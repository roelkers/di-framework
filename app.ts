import { DependencyContainer, Injectable } from "./container";

@Injectable()
class DatabaseService {
  constructor(
  ) { 
    this.bookings = []
  }
  bookings: string[]

  createBooking(bookingId: string) {
    console.log("DatabaseService attempts to create booking...")
    if(!this.bookings.find((id) => id === bookingId)) {
      this.bookings.push(bookingId)
      console.log("DatabaseService: Created Booking.")
    }
    console.log("DatabaseService: booking already exists!")
  }
}

@Injectable()
class BookingService {
  constructor(private readonly databaseService: DatabaseService) {}
  getBookings() {
    console.log("BookingService fetching bookings...");
  }

  createBooking(bookingId: string) {
    console.log("BookingService creates a booking...") 
    return this.databaseService.createBooking(bookingId)
  }
}


@Injectable()
class BookingController {
  constructor(
    private readonly bookingService: BookingService
  ) {}
  get() {
    console.log("BookingController fetching bookings...");
    return this.bookingService.getBookings()
  }

  post(bookingId: string) {
    console.log("BookingController attempts a booking...") 
    return this.bookingService.createBooking(bookingId)
  }
}

const container = new DependencyContainer()
container.initDependencies([BookingController])

const bookingController: BookingController = container.get(BookingController)
console.log(bookingController)
bookingController.get()

