import {getBusData} from './apis/getBusData.ts'

export async function getRoute(RouteID: Number, PathAttributeId: Number) {
var BusData = await getBusData()
return BusData
}

