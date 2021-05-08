
export interface Props {
  width: number;
  height: number;
}

export default function GameWindow(props: any) {
  return (
    <div
      style={{
        display: "flex",
        width: `${props.width - (props.width % 2)}px`,
        height: `${props.height - (props.height % 2)}px`,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {props.children}
    </div>
  );
}
