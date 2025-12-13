import useEmblaCarousel from "embla-carousel-react"
import { Thumb } from "./CarouselThumb"
import { useCallback, useEffect, useState } from "react"
import { Image } from "@/types/Item"

export default function Carousel({ slides }: { slides: Image[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const onSelect = useCallback(() => {
    if (!emblaApi || !emblaThumbsApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaApi.selectedScrollSnap())
  }, [emblaApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()

    emblaApi.on("select", onSelect).on("reInit", onSelect)
  }, [emblaApi, onSelect])

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi || !emblaThumbsApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi, emblaThumbsApi]
  )
  return (
    <div className="">
      <div className="mx-[-1rem] overflow-x-hidden" ref={emblaRef}>
        <div className="embla__container px-2">
          {slides.map((image, index) => (
            <div
              className={
                "embla__slide overflow-y-hidden px-2 w-full" +
                (index == slides.length - 1 ? " mr-2" : "")
              }
              key={index}
            >
              <img
                src={image.url}
                className="w-full aspect-square object-cover object-center rounded-xl"
                alt="Фото товара"
              />
            </div>
          ))}
        </div>
      </div>
      {/* <div ref={emblaThumbsRef} className="overflow-x-hidden">
        <div className="embla flex gap-2 mt-2">
          {slides.map((image, index) => (
            <div className="embla-thumbs__slide" key={index}>
              <Thumb
                key={index}
                selected={index === selectedIndex}
                onClick={() => onThumbClick(index)}
                imageURL={image.url}
              />
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}
