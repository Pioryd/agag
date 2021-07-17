import React from "react";
import AceEditor, { IAceEditorProps } from "react-ace";
import ResizeObserver from "rc-resize-observer";
import { Resizable } from "re-resizable";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

import Panel from "./Panel";

import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";

const modes = ["javascript", "typescript"];

const themes = [
  "monokai",
  "github",
  "tomorrow",
  "kuroir",
  "twilight",
  "xcode",
  "textmate",
  "solarized_dark",
  "solarized_light",
  "terminal"
];

modes.forEach((mode) => {
  require(`ace-builds/src-noconflict/mode-${mode}`);
  require(`ace-builds/src-noconflict/snippets/${mode}`);
});

themes.forEach((theme) => require(`ace-builds/src-noconflict/theme-${theme}`));

interface Size {
  width: number;
  height: number;
}

const PANEL_HEIGHT = 20;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "solid 1px #ddd",
      background: "#f0f0f0"
    },
    content: {
      height: "100%",
      width: "100%"
    }
  })
);

interface Props {
  value: string;
  onSave: (value: string) => void;
}

export default function Editor(props: Props) {
  const classes = useStyles();

  const [size, setSize] = React.useState<Size>({
    width: 500,
    height: 500
  });

  const [draftMode, setDraftMode] = React.useState(false);
  const [value, setValue] = React.useState(props.value);
  const [aceEditorProps, setAceEditorProps] = React.useState<IAceEditorProps>(
    {}
  );

  const onChangeValue = (newValue: string) => {
    setDraftMode(true);
    setValue(newValue);
  };

  const onSave = () => {
    setDraftMode(false);
    props.onSave(value);
  };

  return (
    <Resizable className={classes.root} defaultSize={size}>
      <ResizeObserver onResize={setSize}>
        <div className={classes.content}>
          <Panel
            draftMode={draftMode}
            themes={themes}
            modes={modes}
            onUpdate={setAceEditorProps}
            onSave={onSave}
            height={PANEL_HEIGHT}
          />

          <Box>
            <AceEditor
              {...aceEditorProps}
              width={size.width + "px"}
              height={size.height - PANEL_HEIGHT + "px"}
              onChange={onChangeValue}
            />
          </Box>
        </div>
      </ResizeObserver>
    </Resizable>
  );
}
