import React from "react";
import { IAceEditorProps } from "react-ace";
import { v4 as uuidv4 } from "uuid";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import {
  Box,
  Switch,
  TextField,
  FormControlLabel,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Popover,
  IconButton
} from "@material-ui/core";
import { Settings as SettingsIcon, Save as SaveIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttons: {
      display: "flex",
      justifyContent: "flex-end",
      height: (props: any) => props.height
    },
    iconButton: {
      padding: 0,
      marginRight: 20
    },
    icon: {
      height: 20
    },
    popover: {
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column"
    },
    popoverItem: {
      display: "flex",
      padding: 10,
      justifyContent: "space-around",
      flexDirection: "column"
    }
  })
);

interface Props {
  onUpdate: (props: IAceEditorProps) => void;
  onSave: () => void;
  draftMode: boolean;
  themes: string[];
  modes: string[];
  height: number;
}

export default function Panel({
  onUpdate,
  onSave,
  draftMode,
  themes,
  modes,
  height
}: Props) {
  const classes = useStyles({ height });

  const [uuid] = React.useState(() => uuidv4());
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const popoverId = open ? uuid : undefined;

  const [aceEditorProps, setAceEditorProps] = React.useState<IAceEditorProps>({
    theme: themes[0],
    mode: modes[0],
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: false,
    fontSize: 14,
    showPrintMargin: true,
    highlightActiveLine: true,
    enableSnippets: false
  });

  React.useEffect(() => onUpdate(aceEditorProps), [aceEditorProps, onUpdate]);

  return (
    <>
      <Box className={classes.buttons}>
        {draftMode && (
          <IconButton
            className={classes.iconButton}
            style={{ color: "green" }}
            onClick={onSave}
          >
            <SaveIcon className={classes.icon} />
          </IconButton>
        )}

        <IconButton
          className={classes.iconButton}
          color="primary"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <SettingsIcon className={classes.icon} />
        </IconButton>
      </Box>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <Box className={classes.popover}>
          {Object.keys(aceEditorProps).map((key: string) => {
            if (!(key in aceEditorProps) || key === "value") return null;

            // TODO any fix of it? The above guard doesn't work
            // @ts-ignore
            const value = aceEditorProps[key];
            const label = variableToSentence(key);

            if (typeof value === "boolean") {
              return (
                <div className={classes.popoverItem}>
                  <FormControlLabel
                    key={key}
                    style={{ display: "flex", justifyContent: "space-between" }}
                    control={
                      <Switch
                        size="small"
                        checked={value}
                        onChange={(e) => {
                          setAceEditorProps({
                            ...aceEditorProps,
                            [key]: e.target.checked
                          });
                        }}
                        color="primary"
                      />
                    }
                    label={label}
                    labelPlacement="start"
                  />
                </div>
              );
            } else if (typeof value === "number") {
              return (
                <div className={classes.popoverItem}>
                  <TextField
                    type="number"
                    size="small"
                    key={key}
                    label={label}
                    variant="outlined"
                    value={value}
                    onChange={(e) => {
                      setAceEditorProps({
                        ...aceEditorProps,
                        [key]: e.target.value
                      });
                    }}
                  />
                </div>
              );
            } else if (key === "theme") {
              const labelId = key + "label";
              return (
                <div className={classes.popoverItem}>
                  <FormControl variant="outlined" size="small">
                    <InputLabel id={labelId}>Theme</InputLabel>
                    <Select
                      labelId={labelId}
                      value={value}
                      onChange={(e) => {
                        setAceEditorProps({
                          ...aceEditorProps,
                          [key]: String(e.target.value)
                        });
                      }}
                      label={label}
                    >
                      {themes.map((theme) => (
                        <MenuItem key={theme} value={theme}>
                          <em>{theme}</em>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              );
            } else if (key === "mode") {
              const labelId = key + "label";
              return (
                <div className={classes.popoverItem}>
                  <FormControl variant="outlined" size="small">
                    <InputLabel id={labelId}>Mode</InputLabel>
                    <Select
                      labelId={labelId}
                      value={value}
                      onChange={(e) => {
                        setAceEditorProps({
                          ...aceEditorProps,
                          [key]: String(e.target.value)
                        });
                      }}
                      label={label}
                    >
                      {modes.map((theme) => (
                        <MenuItem key={theme} value={theme}>
                          <em>{theme}</em>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              );
            }
          })}
        </Box>
      </Popover>
    </>
  );
}

function variableToSentence(variable: string) {
  let splitted = variable
    .match(/([A-Z]?[^A-Z]*)/g)
    ?.slice(0, -1)
    .join(" ")
    .toLowerCase();

  if (!splitted) return "";

  return splitted.charAt(0).toUpperCase() + splitted.slice(1);
}
