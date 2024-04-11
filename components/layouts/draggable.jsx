import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Divider, List, ListItem } from "@mui/material";
import theme from "@utils/theme";
import { createContext, useContext, useMemo, useState } from "react";

const SortableItemContext = createContext({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function SortableItem({ children, id }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <ListItem
        sx={{
          display: "flex",
          flexGrow: "1",
          alignItems: "center",
          padding: "0px",
        }}
        ref={setNodeRef}
        style={style}
      >
        {children}
      </ListItem>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <DragIndicatorIcon
      sx={{
        marginRight: "5px",
        cursor: "grab",
      }}
      {...attributes}
      {...listeners}
      ref={ref}
    ></DragIndicatorIcon>
  );
}

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

function SortableOverlay({ children }) {
  return (
    <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
  );
}

export function SortableList({ items, onChange, renderItem }) {
  const [active, setActive] = useState(null);
  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  );
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: 0,
            listStyle: "none",
            marginLeft: "10px",
            padding: "10px",
            borderRadius: "10px",
            border:
              items && items.length > 0
                ? `1px solid ${theme.palette.divider}`
                : "none",
          }}
          role="application"
        >
          {items.map((item, index) => (
            <div
              // style={{ paddingRight: "30px" }}
              key={item.id}
            >
              {renderItem(item)}
              {items && items.length > 3 && index === 2 && (
                <Divider sx={{ marginTop: "10px" }} />
              )}
            </div>
          ))}
        </List>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? renderItem(activeItem) : null}
      </SortableOverlay>
    </DndContext>
  );
}
