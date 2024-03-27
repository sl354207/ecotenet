import Description from "@components/layouts/Description";
import Header from "@components/layouts/Header";
import MapEditor from "@components/maps/MapEditor";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import {
  SortableContext,
  arrayMove as dndKitArrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
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
import { useCallback, useState } from "react";

const CustomChip = styled((props) => <Chip {...props} />)(({ theme }) => ({
  borderWidth: 2,
  color: theme.palette.text.primary,
  height: 40,
  margin: "0px 5px 10px 5px",

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

const arrayMove = (array, oldIndex, newIndex) => {
  return dndKitArrayMove(array, oldIndex, newIndex);
};

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

          if (itemGroups.group1.length <= 3) {
            setItemGroups({
              group1: [...itemGroups.group1, result],
              group2: [],
            });
          } else {
            setItemGroups({
              group1: [...itemGroups.group1],
              group2: [...itemGroups.group2, result],
            });
          }
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

    setItemGroups({
      group1: itemGroups.group1.filter((i) => i !== item),
      group2: [...itemGroups.group2],
    });
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

  //
  //
  //

  const Item = ({ id, items, dragOverlay }) => {
    const style = {
      cursor: dragOverlay ? "grabbing" : "grab",
    };

    return (
      // <ListItemText
      //   // style={style}
      //   sx={{ cursor: dragOverlay ? "grabbing" : "grab" }}
      // >
      //   Item {id}
      // </ListItemText>
      <CustomChip
        label={
          id.common_name
            ? `${id.scientific_name} - ${id.common_name}`
            : id.scientific_name
        }
        onClick={() => {
          window.open(
            `/species/${id.scientific_name.replace(/ /g, "_")}`,
            "_blank",
            "noopener,noreferrer"
          );
        }}
        onDelete={() => handleRemoveChip(id)}
        variant="outlined"
        sx={{
          borderColor:
            items && items.indexOf(id) === 0
              ? "#ff00ff"
              : items && items.indexOf(id) === 1
              ? "yellow"
              : items && items.indexOf(id) === 2
              ? "cyan"
              : "white",
          // cursor: dragOverlay ? "grabbing" : "grab",
          // width: "fit-content",
        }}
      ></CustomChip>
    );
  };

  const SortableItem = ({ id, items }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,

      // background-color: white;
    };
    // console.log(items);

    return (
      <ListItem
        style={style}
        sx={{
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          // width: "110px",
          // height: "30px",
          // marginBottom: "5px",
          // paddingLeft: "5px",
          // border: "1px solid #ff00ff",
          padding: "0px",
          borderRadius: "5px",
          userSelect: "none",
        }}
      >
        {items.indexOf(id)}
        <DragIndicatorIcon
          sx={{
            cursor: "grab",
          }}
          ref={setNodeRef}
          {...attributes}
          {...listeners}
        ></DragIndicatorIcon>
        <Item id={id} items={items} />
      </ListItem>
    );
  };

  const Droppable = ({ id, items }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
      <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
        <List
          sx={{
            minWidth: "110px",
            padding: "20px 10px",
            border: "1px solid white",
            borderRadius: "5px",
            listStyleType: "none",
            marginRight: "5px",
            minHeight: "150px",
          }}
          ref={setNodeRef}
        >
          {items.map((item) => (
            <SortableItem key={item} id={item} items={items} />
          ))}
        </List>
      </SortableContext>
    );
  };

  const [itemGroups, setItemGroups] = useState({
    group1: [],
    group2: [],
  });
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragCancel = () => setActiveId(null);

  const handleDragOver = ({ active, over }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer !== overContainer) {
      setItemGroups((itemGroups) => {
        const activeIndex = active.data.current.sortable.index;
        const overIndex =
          over.id in itemGroups
            ? itemGroups[overContainer].length + 1
            : over.data.current.sortable.index;

        return moveBetweenContainers(
          itemGroups,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
      const activeIndex = active.data.current.sortable.index;
      const overIndex =
        over.id in itemGroups
          ? itemGroups[overContainer].length + 1
          : over.data.current.sortable.index;

      setItemGroups((itemGroups) => {
        let newItems;
        if (activeContainer === overContainer) {
          newItems = {
            ...itemGroups,
            [overContainer]: arrayMove(
              itemGroups[overContainer],
              activeIndex,
              overIndex
            ),
          };
        } else {
          newItems = moveBetweenContainers(
            itemGroups,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            active.id
          );
        }

        return newItems;
      });
    }

    setActiveId(null);
  };

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
    };
  };
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
          <DndContext
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
                />
              ))}
            </div>
            <DragOverlay>
              {activeId ? <Item id={activeId} dragOverlay /> : null}
            </DragOverlay>
          </DndContext>
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
