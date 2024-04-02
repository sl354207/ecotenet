import Description from "@components/layouts/Description";
import Header from "@components/layouts/Header";
import MapEditor from "@components/maps/MapEditor";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
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
import {
  Autocomplete,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";
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
          result.id = result.scientific_name;
          setItems([...items, result]);
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
    setItems((items) => items.filter((i) => i !== item));
  };

  const selectInterSecting = (items) => {
    // Get all arrays of numbers
    const arraysOfNumbers = items.map((obj) => obj.unique_id);

    // Find the intersection of all arrays
    const sharedNumbers = arraysOfNumbers.reduce(
      (accumulator, currentArray) => {
        return accumulator.filter((value) => currentArray.includes(value));
      }
    );

    setClickInfo(sharedNumbers);
  };

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

  function DragHandle() {
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
              <div style={{ paddingRight: "30px" }} key={item.id}>
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
              disabled={items.length === 15}
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
              disabled={items.length === 0}
              onClick={() => {
                setClickInfo(
                  items
                    .map((item) => item.unique_id)
                    .reduce((acc, id) => acc.concat(id), [])
                );
              }}
            >
              Select All
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginRight: "5px", marginBottom: "10px" }}
              disabled={clickInfo.length === 0}
              onClick={() => setClickInfo([])}
            >
              Clear All
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ marginBottom: "10px" }}
              onClick={() => selectInterSecting(items)}
              disabled={items.length <= 1}
            >
              Select Intersecting
            </Button>
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
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
                  }}
                ></CustomChip>
              </SortableItem>
            )}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" align="left">
        Ecoregions:* {clickInfo.map((region) => `Eco-${region}, `)}
      </Typography>

      <MapEditor
        clickInfo={clickInfo}
        handleDblClick={handleMapClick}
        state={items}
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
