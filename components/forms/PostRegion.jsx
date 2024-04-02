import Description from "@components/layouts/Description";
import Header from "@components/layouts/Header";
import MapEditor from "@components/maps/MapEditor";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
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

import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";

// import { CSS } from "@dnd-kit/utilities";
import {
  Autocomplete,
  Button,
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";
// import { forwardRef, useCallback, useState } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const CustomChip = styled((props) => <Chip {...props} />)(({ theme }) => ({
  borderWidth: 2,
  color: theme.palette.text.primary,
  height: 40,
  margin: "0px 0px 0px 0px",

  "& .MuiChip-deleteIcon": {
    WebkitTapHighlightColor: "transparent",
    color: theme.palette.secondary.main,
    fontSize: 22,
    cursor: "pointer",
    margin: "0 5px 0 -6px",
    "&:hover": {
      color: alpha(theme.palette.secondary.main, 0.7),
    },
  },
}));

const removeAtIndex = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

const insertAtIndex = (array, index, item) => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

// const arrayMove = (array, oldIndex, newIndex) => {
//   return dndKitArrayMove(array, oldIndex, newIndex);
// };

//pass in and destructure props.
const PostRegion = ({ clickInfo, setClickInfo }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const [results, setResults] = useState([]);

  const handleAutoChange = async (e) => {
    if (e.target.value) {
      const regex = /[`!@#$%^&*()_+=\[\]{};:"\\\|,.<>\/?~]/;
      if (!regex.test(e.target.value)) {
        const res = await fetch(`/api/search/auto?q=${e.target.value}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();

          setResults(data);
        }
      }
    }
  };

  const handleAutoSubmit = (event, newValue) => {
    if (newValue !== null) {
      let name;
      if (newValue.includes(" - ")) {
        const dash = newValue.indexOf(" - ");
        name = newValue.slice(0, dash);
      } else {
        name = newValue;
      }

      for (const result of results) {
        if (result.scientific_name === name) {
          setClickInfo((clickInfo) => [...clickInfo, result.unique_id]);

          // if (itemGroups.group1.length < 3) {
          //   setItemGroups({
          //     group1: [...itemGroups.group1, result],
          //     group2: [],
          //   });
          // } else {
          //   setItemGroups({
          //     group1: [...itemGroups.group1],
          //     group2: [...itemGroups.group2, result],
          //   });
          // }
          result.id = result.scientific_name;
          setItems([...items, result]);
        } else {
          setClickInfo([]);
        }
      }

      setResults([]);
    }
  };

  const handleMapClick = useCallback((event) => {
    const region = event.features && event.features[0];

    if (region && region.properties.unique_id !== "<NA>") {
      setClickInfo((clickInfo) => {
        if (!clickInfo.includes(region && region.properties.unique_id)) {
          return [...clickInfo, region && region.properties.unique_id];
        } else {
          clickInfo.splice(clickInfo.indexOf(region.properties.unique_id), 1);

          return [...clickInfo];
        }
      });
    }
  }, []);

  const handleRemoveChip = (item) => {
    // dispatch({ type: "REMOVE_ITEM", payload: item });
    // remove item from itemsGroups

    // setItemGroups({
    //   group1: itemGroups.group1.filter((i) => i !== item),
    //   group2: itemGroups.group2.filter((i) => i !== item),
    // });

    setItems((items) => items.filter((i) => i !== item));
  };
  const selectInterSecting = (first, second, third) => {
    let rest = [];
    if (second.length !== 0) {
      rest = [...rest, second];
    }
    if (third.length !== 0) {
      rest = [...rest, third];
    }

    rest = rest.map((array) => new Set(array));

    const intersecting = first.filter((e) => rest.every((set) => set.has(e)));
    setClickInfo(intersecting);
  };

  // import "./styles.css";

  // import "../src/components/SortableList/components/SortableItem/SortableItem.css";

  const [items, setItems] = useState([]);

  const SortableItemContext = createContext({
    attributes: {},
    listeners: undefined,
    ref() {},
  });

  function SortableItem({ children, id }) {
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
          // className="SortableItem"
          sx={{
            display: "flex",
            // justifyContent: "space-between",
            flexGrow: "1",
            alignItems: "center",
            padding: "0px",
            // backgroundColor: "#fff",
            // boxShadow: '0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
            //   0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'
            // borderRadius: "calc(4px / var(--scale-x, 1))",
            // boxSizing: "border-box",
            // listStyle: "none",
            // color: "#333",
            // font-weight: 400;
            // font-size: 1rem;
            // font-family: sans-serif;
          }}
          ref={setNodeRef}
          style={style}
        >
          {children}
        </ListItem>
      </SortableItemContext.Provider>
    );
  }

  function DragHandle() {
    const { attributes, listeners, ref } = useContext(SortableItemContext);

    return (
      // <button className="DragHandle" {...attributes} {...listeners} ref={ref}>
      //   <svg viewBox="0 0 20 20" width="12">
      //     <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      //   </svg>
      // </button>
      <DragIndicatorIcon
        sx={{
          cursor: "grab",
          // color: theme.palette.secondary.light,
        }}
        // ref={setNodeRef}
        // {...attributes}
        // {...listeners}
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

  // import "../src/components/SortableList/SortableList.css";

  function SortableList({ items, onChange, renderItem }) {
    const [active, setActive] = useState(null);
    const activeItem = useMemo(
      () => items.find((item) => item.id === active?.id),
      [active, items]
    );
    const sensors = useSensors(
      useSensor(PointerSensor),
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
            }}
            role="application"
          >
            {items.map((item) => (
              <div key={item.id}>{renderItem(item)}</div>
            ))}
          </List>
        </SortableContext>
        <SortableOverlay>
          {activeItem ? renderItem(activeItem) : null}
        </SortableOverlay>
      </DndContext>
    );
  }

  //
  //
  //

  // const Item = ({ id, items, group, dragOverlay }) => {
  //   const style = {
  //     cursor: dragOverlay ? "grabbing" : "grab",
  //   };

  //   return (
  //     // <ListItemText
  //     //   // style={style}
  //     //   sx={{ cursor: dragOverlay ? "grabbing" : "grab" }}
  //     // >
  //     //   Item {id}
  //     // </ListItemText>
  //     <CustomChip
  //       label={
  //         id.common_name
  //           ? `${id.scientific_name} - ${id.common_name}`
  //           : id.scientific_name
  //       }
  //       onClick={() => {
  //         window.open(
  //           `/species/${id.scientific_name.replace(/ /g, "_")}`,
  //           "_blank",
  //           "noopener,noreferrer"
  //         );
  //       }}
  //       onDelete={() => handleRemoveChip(id)}
  //       variant="outlined"
  //       sx={{
  //         borderColor:
  //           group === "group1"
  //             ? items && items.indexOf(id) === 0
  //               ? "#ff00ff"
  //               : items && items.indexOf(id) === 1
  //               ? "yellow"
  //               : items && items.indexOf(id) === 2
  //               ? "cyan"
  //               : theme.palette.text.primary
  //             : theme.palette.text.primary,

  //         // cursor: dragOverlay ? "grabbing" : "grab",
  //         // width: "fit-content",
  //       }}
  //     ></CustomChip>
  //   );
  // };

  // const Item = forwardRef(({ id, ...props }, ref) => {
  //   return (
  //     <div {...props} ref={ref}>
  //       {id}
  //     </div>
  //   );
  // });

  // const SortableItem = ({ id, items, group }) => {
  //   const {
  //     attributes,
  //     listeners,
  //     setNodeRef,
  //     transform,
  //     transition,
  //     isDragging,
  //   } = useSortable({ id });

  //   const style = {
  //     transform: CSS.Transform.toString(transform),
  //     transition,
  //     opacity: isDragging ? 0.5 : 1,

  //     // background-color: white;
  //   };
  //   // console.log(items);

  //   return (
  //     <ListItem
  //       style={style}
  //       sx={{
  //         display: "flex",
  //         alignItems: "center",
  //         boxSizing: "border-box",
  //         // width: "110px",
  //         // height: "30px",
  //         // marginBottom: "5px",
  //         // paddingLeft: "5px",
  //         borderBottom: items.indexOf(id) === 2 ? "1px solid #ff00ff" : "none",
  //         padding: "0px",
  //         borderRadius: "5px",
  //         userSelect: "none",
  //       }}
  //     >
  //       {items.indexOf(id)}
  //       <DragIndicatorIcon
  //         sx={{
  //           cursor: "grab",
  //         }}
  //         ref={setNodeRef}
  //         {...attributes}
  //         {...listeners}
  //       ></DragIndicatorIcon>
  //       <Item id={id} items={items} group={group} />
  //     </ListItem>
  //   );
  // };

  // const SortableItem = (props) => {
  //   const { value } = props;
  //   const { attributes, listeners, setNodeRef, transform, transition } =
  //     useSortable({ id: props.id });

  //   const style = {
  //     transform: CSS.Transform.toString(transform),
  //     transition,
  //   };

  //   return (
  //     <Item ref={setNodeRef} style={style} {...attributes} {...listeners}>
  //       {value}
  //     </Item>
  //   );
  // };

  // const Droppable = ({ id, items, group }) => {
  //   const { setNodeRef } = useDroppable({ id });

  //   return (
  //     <SortableContext
  //       id={id}
  //       items={items}
  //       group={group}
  //       strategy={rectSortingStrategy}
  //     >
  //       <List
  //         sx={{
  //           minWidth: "110px",
  //           padding: "20px 10px",
  //           border: "1px solid white",
  //           borderRadius: "5px",
  //           listStyleType: "none",
  //           marginRight: "5px",
  //           minHeight: "150px",
  //         }}
  //         ref={setNodeRef}
  //       >
  //         {items.map((item) => (
  //           <SortableItem key={item} id={item} items={items} group={group} />
  //         ))}
  //       </List>
  //     </SortableContext>
  //   );
  // };

  // const [itemGroups, setItemGroups] = useState({
  //   group1: [],
  //   group2: [],
  // });
  // const [activeId, setActiveId] = useState(null);

  // const sensors = useSensors(
  //   useSensor(MouseSensor),
  //   useSensor(TouchSensor),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   })
  // );

  // const handleDragStart = ({ active }) => setActiveId(active.id);

  // const handleDragCancel = () => setActiveId(null);

  // const handleDragOver = ({ active, over }) => {
  //   const overId = over?.id;

  //   if (!overId) {
  //     return;
  //   }

  //   const activeContainer = active.data.current.sortable.containerId;
  //   const overContainer = over.data.current?.sortable.containerId || over.id;

  //   if (activeContainer !== overContainer) {
  //     setItemGroups((itemGroups) => {
  //       const activeIndex = active.data.current.sortable.index;
  //       const overIndex =
  //         over.id in itemGroups
  //           ? itemGroups[overContainer].length + 1
  //           : over.data.current.sortable.index;

  //       return moveBetweenContainers(
  //         itemGroups,
  //         activeContainer,
  //         activeIndex,
  //         overContainer,
  //         overIndex,
  //         active.id
  //       );
  //     });
  //   }
  // };

  // const handleDragEnd = ({ active, over }) => {
  //   if (!over) {
  //     setActiveId(null);
  //     return;
  //   }

  //   if (active.id !== over.id) {
  //     const activeContainer = active.data.current.sortable.containerId;
  //     const overContainer = over.data.current?.sortable.containerId || over.id;
  //     const activeIndex = active.data.current.sortable.index;
  //     const overIndex =
  //       over.id in itemGroups
  //         ? itemGroups[overContainer].length + 1
  //         : over.data.current.sortable.index;

  //     setItemGroups((itemGroups) => {
  //       let newItems;
  //       if (activeContainer === overContainer) {
  //         newItems = {
  //           ...itemGroups,
  //           [overContainer]: arrayMove(
  //             itemGroups[overContainer],
  //             activeIndex,
  //             overIndex
  //           ),
  //         };
  //       } else {
  //         newItems = moveBetweenContainers(
  //           itemGroups,
  //           activeContainer,
  //           activeIndex,
  //           overContainer,
  //           overIndex,
  //           active.id
  //         );
  //       }

  //       return newItems;
  //     });
  //   }

  //   setActiveId(null);
  // };

  // const moveBetweenContainers = (
  //   items,
  //   activeContainer,
  //   activeIndex,
  //   overContainer,
  //   overIndex,
  //   item
  // ) => {
  //   return {
  //     ...items,
  //     [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
  //     [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
  //   };
  // };

  // const [activeId, setActiveId] = useState(null);
  // const [items, setItems] = useState(["1", "2", "3"]);
  // const sensors = useSensors(
  //   useSensor(PointerSensor),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   })
  // );
  // function handleDragStart(event) {
  //   const { active } = event;

  //   setActiveId(active.id);
  // }

  // function handleDragEnd(event) {
  //   const { active, over } = event;

  //   if (active.id !== over.id) {
  //     setItems((items) => {
  //       const oldIndex = items.indexOf(active.id);
  //       const newIndex = items.indexOf(over.id);

  //       return arrayMove(items, oldIndex, newIndex);
  //     });
  //   }

  //   setActiveId(null);
  // }

  // const [items, setItems] = useState([{ id: 1 }, { id: 2 }, { id: 3 }]);
  return (
    <Container>
      <Header title="Select Ecoregions" />

      <Description
        description="To help determine which ecoregions your post applies to you can add single or multiple species distributions to the map. These distributions may help you determine relevant ecoregions for your post. You may add or delete
        ecoregions by double clicking on the map. A single click highlights the
        ecoregion and displays the Eco-ID and ecoregion name"
        align="left"
      />

      <Typography variant="body1" align="left">
        Search for a species by common or scientific name to display their
        distribution on the map. A maximum of three species can be mapped at the
        same time
      </Typography>
      <Typography variant="body1" align="left" sx={{ marginTop: "20px" }}>
        *denotes required field
      </Typography>
      <Grid container>
        <Grid item xs={12} md={6}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Autocomplete
              sx={{
                "& .MuiAutocomplete-inputRoot": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha("#94c9ff", 0.8),
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha("#94c9ff", 0.8),
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#94c9ff",
                  },
                  "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha("#94c9ff", 0.3),
                  },
                  "&.Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha("#94c9ff", 0.3),
                  },
                  "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e57373",
                  },
                  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e57373",
                  },
                },
              }}
              autoHighlight
              onChange={(event, newValue) => handleAutoSubmit(event, newValue)}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="region-auto"
              options={
                results
                  ? results.map((obj) => {
                      if (obj.common_name) {
                        return `${obj.scientific_name} - ${obj.common_name}`;
                      } else {
                        return `${obj.scientific_name}`;
                      }
                    })
                  : []
              }
              filterOptions={(x) => x}
              freeSolo
              renderInput={(params) => (
                // ...params is causing error check dashboard index on how to log params
                <TextField
                  {...params}
                  id="region"
                  placeholder="Search…"
                  variant="outlined"
                  ref={params.InputProps.ref}
                  inputProps={{
                    ...params.inputProps,
                    type: "text",
                    maxLength: 100,
                  }}
                  onChange={(e) => handleAutoChange(e)}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginRight: "5px", marginBlock: "10px" }}
              // disabled={state.items.length === 0}
              // onClick={() => {
              //   setClickInfo(
              //     state[1].regions.concat(state[2].regions, state[3].regions)
              //   );
              // }}
            >
              Select All
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginRight: "5px", marginBottom: "10px" }}
              // disabled={state.items.length === 0}
              onClick={() => setClickInfo([])}
            >
              Clear All
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginBottom: "10px" }}
              // onClick={() =>
              //   selectInterSecting(
              //     state[1].regions,
              //     state[2].regions,
              //     state[3].regions
              //   )
              // }
              // disabled={state.items.length <= 1}
            >
              Select Intersecting
            </Button>
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div
              style={{
                // display: "flex",
                marginLeft: "10px",
              }}
            >
              {Object.keys(itemGroups).map((group) => (
                <Droppable
                  id={group}
                  items={itemGroups[group]}
                  activeId={activeId}
                  key={group}
                  group={group}
                />
              ))}

            </div>
            <DragOverlay>
              {activeId ? <Item id={activeId} dragOverlay /> : null}
            </DragOverlay>
          </DndContext> */}
          {/* <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map((id) => (
                <SortableItem key={id} id={id} />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId ? <Item id={activeId} /> : null}
            </DragOverlay>
          </DndContext> */}
          <div style={{ maxWidth: 400, margin: "30px auto" }}>
            <SortableList
              items={items}
              onChange={setItems}
              renderItem={(item) => (
                <SortableItem id={item.id}>
                  <DragHandle />
                  <CustomChip
                    label={
                      item.common_name
                        ? `${item.scientific_name} - ${item.common_name}`
                        : item.scientific_name
                    }
                    onClick={() => {
                      window.open(
                        `/species/${item.scientific_name.replace(/ /g, "_")}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    onDelete={() => handleRemoveChip(item)}
                    variant="outlined"
                    sx={{
                      borderColor:
                        items && items.indexOf(item) === 0
                          ? "#ff00ff"
                          : items && items.indexOf(item) === 1
                          ? "yellow"
                          : items && items.indexOf(item) === 2
                          ? "cyan"
                          : theme.palette.secondary.main,
                      // borderColor:
                      //   group === "group1"
                      //     ? items && items.indexOf(id) === 0
                      //       ? "#ff00ff"
                      //       : items && items.indexOf(id) === 1
                      //       ? "yellow"
                      //       : items && items.indexOf(id) === 2
                      //       ? "cyan"
                      //       : theme.palette.text.primary
                      //     : theme.palette.text.primary,
                      // cursor: dragOverlay ? "grabbing" : "grab",
                      // width: "fit-content",
                    }}
                  ></CustomChip>
                </SortableItem>
              )}
            />
          </div>
        </Grid>
      </Grid>

      <Typography variant="h6" align="left">
        Ecoregions:* {clickInfo.map((region) => `Eco-${region}, `)}
      </Typography>

      <MapEditor
        clickInfo={clickInfo}
        handleDblClick={handleMapClick}
        // state={state}
      />
      <Typography variant="subtitle2" align="left" sx={{ marginTop: "10px" }}>
        A species distribution often does not align perfectly with ecoregion
        boundaries, therefore a species may not be present throughout the entire
        ecoregion but only in specific areas. A species may also be widespread
        but in small numbers so rarely seen.
      </Typography>
    </Container>
  );
};

export default PostRegion;
