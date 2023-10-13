import { DependencyContainer, Injectable } from "./container";

@Injectable()
class DatabaseService {
  constructor(
  ) { 
    this.bookings = []
    this.invoices = []
  }
  bookings: string[]
  invoices: { id: string, bookings: string[] }[]

  createBooking(bookingId: string) {
    console.log("DatabaseService attempts to create booking...")
    if(!this.bookings.find((id) => id === bookingId)) {
      this.bookings.push(bookingId)
      return console.log("DatabaseService: Created Booking.")
    }
    console.log("DatabaseService: booking already exists!")
  }

  createInvoice(invoiceId: string) {
    console.log("DatabaseService attempts to create an invoice...")
    if(!this.invoices.find((i) => i.id === invoiceId)) {
      this.invoices.push({ id: invoiceId, bookings: []})
      return console.log("DatabaseService: Created Invoice.")
    } 
    console.log("DatabaseService: invoice already exists!")
  }

  updateInvoiceWithBooking(invoiceId: string, bookingId: string) {
    console.log("DatabaseService attempts to update an invoice...")
    const invoice = this.invoices.find((i) => i.id === invoiceId)
    if(invoice) {
      invoice.bookings.push(bookingId)
      return console.log("DatabaseService: Updated Invoice.")
    }
    console.log("DatabaseService: invoice does not exist!")
  }
}


@Injectable()
class InvoiceService {
  constructor(private readonly databaseService: DatabaseService) {}

  createInvoice(invoiceId: string) {
    console.log("InvoiceService creates an invoice...") 
    return this.databaseService.createInvoice(invoiceId)
  }

  updateInvoice(invoiceId: string, bookingId: string) {
    console.log("InvoiceService updates an invoice...") 
    return this.databaseService.updateInvoiceWithBooking(invoiceId, bookingId)
  }
}

@Injectable()
class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService
  ) {}
  post(bookingId: string) {
    console.log("InvoiceController attempts an invoice...") 
    return this.invoiceService.createInvoice(bookingId)
  }
}


@Injectable()
class BookingService {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly databaseService: DatabaseService
  ) {}
  getBookings() {
    console.log("BookingService fetching bookings...");
  }

  createBooking(bookingId: string, invoiceId: string) {
    console.log("BookingService creates a booking...") 
    this.databaseService.createBooking(bookingId)
    this.invoiceService.updateInvoice(invoiceId, bookingId)
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

  post(bookingId: string, invoiceId: string) {
    console.log("BookingController attempts a booking...") 
    return this.bookingService.createBooking(bookingId, invoiceId)
  }
}

const container = new DependencyContainer()
container.initDependencies([InvoiceController,BookingController])

const bookingController: BookingController = container.get(BookingController)
const invoiceController: InvoiceController = container.get(InvoiceController)

invoiceController.post("1")
bookingController.post("1234","1")
bookingController.get()

