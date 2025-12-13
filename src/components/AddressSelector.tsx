import {
  YMaps,
  Map,
  Placemark,
  ZoomControl,
  GeolocationControl,
  Clusterer,
  GeoObject,
} from "@pbe/react-yandex-maps"
import { deliveryGeojson } from "@/constants/delivery"
import { useRef } from "react"

export default function AddressSelector() {
  const mapRef = useRef<any>(null)

  return (
    <div>
      <YMaps>
        <Map
          defaultState={{ center: [59.932464, 30.349258], zoom: 10 }}
          width="100%"
          height="300px"
          instanceRef={(ref: any) => (mapRef.current = ref)}
        >
          <ZoomControl />
          <GeolocationControl />
          {deliveryGeojson.features.map((feature, index) => (
            <GeoObject
              key={index}
              geometry={feature.geometry}
              properties={feature.properties}
              options={{
                fillColor: feature.properties.fill,
                fillOpacity: feature.properties["fill-opacity"],
                strokeColor: feature.properties.stroke,
                strokeWidth: feature.properties["stroke-width"],
                strokeOpacity: feature.properties["stroke-opacity"],
              }}
            />
          ))}
        </Map>
      </YMaps>
    </div>
  )
}
