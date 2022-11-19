export default function Handle() {
  return <div className="handle buttonReset" />;
}

const onDrag: React.DragEventHandler<HTMLButtonElement> = (e) => {
  console.log(e);
};
