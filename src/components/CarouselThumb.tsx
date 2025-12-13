export const Thumb = ({
  imageURL,
  selected,
  onClick,
}: {
  imageURL: string
  selected: boolean
  onClick: any
}) => {
  return (
    <div className="pressable">
      <button
        onClick={onClick}
        type="button"
        className={`embla-thumbs__slide__number w-16 h-16 rounded-md flex items-center justify-center overflow-hidden border-2 box- ${
          selected
            ? "border-[var(--tg-theme-button-color)]"
            : "border-transparent"
        }`}
      >
        <img
          src={imageURL}
          alt="image"
          className="object-cover object-center w-full h-full"
        />
      </button>
    </div>
  )
}
