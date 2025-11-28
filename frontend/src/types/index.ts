export enum AdSpaceType {
    BILLBOARD = "BILLBOARD",
    BUS_STOP = "BUS_STOP",
    MALL_DISPLAY = "MALL_DISPLAY",
    TRANSIT_AD = "TRANSIT_AD"
}

export enum AdSpaceStatus {
    AVAILABLE = "AVAILABLE",
    BOOKED = "BOOKED",
    MAINTENANCE = "MAINTENANCE"
}

export interface AdSpace {
    id: number;
    name: string;
    type: AdSpaceType;
    location: string;
    pricePerDay: number;
    status: AdSpaceStatus;
}

export interface BookingRequest {
    id?: number;
    adSpace: { id: number }; 
    advertiserName: string;
    advertiserEmail: string;
    startDate: string;
    endDate: string;
    totalCost?: number;
    status?: string;
}