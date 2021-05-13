export default function GameWindow(props: any) {
  return (
    <div
      id="game-window"
      style={{
        position: "relative",
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "none",
        margin: 0,
        padding: 0,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {props.children}
    </div>
  );
}
