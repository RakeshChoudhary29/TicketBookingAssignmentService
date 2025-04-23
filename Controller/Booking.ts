import { Request, Response } from "express";
import { seatsService } from "../Service/seatsService";

export const getTicketData = async (req: Request, res: Response) => {
  try {
    const data = await seatsService.getSeatsData();
    res.json({ success: true, seatsData: data });
  } catch (error: any) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
      error: error,
      seatsData: [],
    });
  }
};

const assignSeatsInRow = (seatsGrid: number[][], ticketCount: number) => {
  for (let i = 0; i < seatsGrid.length; i++) {
    let row = seatsGrid[i];
    // if consecutive ticketCount is available in the row
    let count = 0;
    for (let j = 0; j < row.length; j++) {
      if (row[j] == 1) {
        count = 0;
      } else count++;

      // found tickcount seats in a row
      if (count == ticketCount) {
        //  [ x,    j-1,j]  [j-ticketCount+1,....,j];
        const seatsArr = Array.from({ length: ticketCount }, (_, index) => {
          return i * 7 + (j - index) + 1; // Adjust seat index calculation
        });
        return seatsArr.reverse();
      }
    }
  }

  return [];
};

// taking the elements from  the row and next rows to it
const getSeats = (
  seatsGrid: number[][],
  tickcount: number,
  row: number
): number[][] => {
  // start from the row th row and keep adding the new seats

  let m = seatsGrid.length,
    n = seatsGrid[0].length;
  let seatsArr: number[][] = [];
  let seatsCount = 0;

  for (let i = row; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (seatsGrid[i][j] == 0) {
        seatsArr.push([i, j]);
        seatsCount++;
        if (seatsCount == tickcount) return seatsArr;
      }
    }
  }

  return [];
};

// calculate the cost of the arr
// the measure that the seats are  near

const calCost = (seatsArr: number[][]) => {
  // only penlty for diff raw => this prioratize the min row changes
  let n = seatsArr.length;
  let cost = 0;

  // try to keep most number of seats in the same row
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      cost += Math.abs(seatsArr[j][0] - seatsArr[i][0]);
    }

    // +Math.abs(seatsArr[i - 1][1] - seatsArr[i][1]);
  }

  return cost;
};

const assignNearestTickets = (seatsGrid: number[][], ticketCount: number) => {
  // using another approach if no seats available in one row

  let m = seatsGrid.length;
  let n = seatsGrid[0].length;

  let selectedSeats: number[][] = [];
  let minCost: number = Infinity;

  // start the seats from each row and keep adding the seats and
  // calculate the cost of the selected seats
  for (let i = 0; i < m; i++) {
    const seatsArr = getSeats(seatsGrid, ticketCount, i);

    if (seatsArr && seatsArr.length) {
      //calculate the cost of this arr
      const cost = calCost(seatsArr);
      if (cost < minCost) {
        minCost = cost;
        selectedSeats = seatsArr;
      }
    }
  }
  // convert the index (i,j) to the nubmer
  return selectedSeats.map((value) => value[0] * 7 + value[1] + 1);
};

const assignSeats = (seatsGrid: number[][], ticketCount: number) => {
  let currBooked = assignSeatsInRow(seatsGrid, ticketCount);

  if (!currBooked || currBooked.length == 0) {
    // no seats available in one row find other seats
    currBooked = assignNearestTickets(seatsGrid, ticketCount);
  }

  return currBooked;
};

export const bookTickets = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { ticketCount } = req.body;

    const ticketsData = await seatsService.getSeatsData();

    // make 2D array of the seats
    // make 12*7 2D array
    // 0=> AvailableSeats
    // 1=>bookedSeats
    let seatsGrid: number[][] = Array.from({ length: 12 }, () =>
      Array(7).fill(1)
    );

    ticketsData.map((seat: any) => {
      const seat_number = seat.seat_number;
      const row = Math.floor((seat_number - 1) / 7);
      const col = (seat_number - 1) % 7;
      seatsGrid[row][col] = seat.booked ? 1 : 0;
    });

    const seatsArr = assignSeats(seatsGrid, ticketCount);

    console.log(seatsArr, ticketCount);

    if (!seatsArr || seatsArr.length == 0) {
      res.json({
        success: true,
        message: "No Seats Available",
        bookedSeats: seatsArr,
      });
      return;
    }

    //if seats Arr assign these seats in atomic operation
    const response: any = await seatsService.bookSeats(seatsArr, "");

    if (!response.success) {
      res.json({
        success: false,
        message: response.message,
        error: response.error,
      });
    }

    res.json({
      success: true,
      message: "Seats Assigned Successfully",
      bookedSeats: seatsArr,
    });
  } catch (error: any) {
    console.log("error in bookTickets", error);
    res.json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const resetTickets = async (req: Request, res: Response) => {
  try {
    const resp: any = seatsService.resetSeats();

    if (resp) {
      res.json({ success: true, message: "Seats cleared Successfully" });
      return;
    }
    //   res.json({success:false,message})
  } catch (error: any) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};
