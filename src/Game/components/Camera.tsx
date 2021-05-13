export default function Camera(props: any) {
  return (
    <div
      style={{
        position: "relative",
        userSelect: "none",
        width: "100%",
        height: "100%",
        overflow: "none"
      }}
    >
      {props.children}
    </div>
  );
}
