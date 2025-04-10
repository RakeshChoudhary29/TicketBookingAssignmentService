import { Request, Response } from "express";
import { seatsService } from "../Service/seatsService";

export const getTicketData = async (req: Request, res: Response) => {
  const data = await seatsService.getSeatsData();
  res.json({ success: true, seatsData: data });
};

const directions = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

const DFS = (
  seatsGrid: number[][],
  visited: boolean[][],
  elements: number[],
  i: number,
  j: number
) => {
  let m = seatsGrid.length;
  let n = seatsGrid[0].length;

  if (
    i < 0 ||
    i >= m ||
    j < 0 ||
    j >= n ||
    visited[i][j] ||
    seatsGrid[i][j] == 1
  )
    return;

  elements.push(i * 7 + j + 1);
  visited[i][j] = true;

  for (let dir of directions) {
    DFS(seatsGrid, visited, elements, i + dir[0], j + dir[1]);
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

const assignNearestTickets = (seatsGrid: number[][], ticketCount: number) => {
  // use DFS to find the connected clusters
  // and then assign seats

  let m = seatsGrid.length;
  let n = seatsGrid[0].length;
  const visited: boolean[][] = Array.from({ length: m }, () =>
    Array(n).fill(false)
  );

  let clusterArr: number[][] = [];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < m; j++) {
      if (visited[i][j] || seatsGrid[i][j] == 1) continue;

      const elements: number[] = [];
      DFS(seatsGrid, visited, elements, i, j);
      if (elements && elements.length) clusterArr.push(elements);

      // if any cluster is of the size greater then  ticketCount send that cluster
      if (elements.length >= ticketCount) return elements.slice(0, ticketCount);
    }
  }

  // require multiple cluster to make ticketCount seats

  clusterArr.sort((a: any, b: any) => a.length - b.length);

  let bookSeats = [];

  for (let cluster of clusterArr) {
    let remainingSeats: number = ticketCount - bookSeats.length;

    if (remainingSeats > cluster.length) {
      // add all the elements into the bookSeats
      bookSeats.push(...cluster);
    } else {
      bookSeats.push(...cluster.slice(0, remainingSeats));
      break;
    }
  }

  if (bookSeats.length == ticketCount) return bookSeats;

  return [];
};

const assignSeats = (seatsGrid: number[][], ticketCount: number) => {
  let currBooked = assignSeatsInRow(seatsGrid, ticketCount);

  if (!currBooked || currBooked.length == 0) {
    // no seats available in one row find other seats
    currBooked = assignNearestTickets(seatsGrid, ticketCount);
    console.log("from cluster", currBooked);
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

    ticketsData.map((seat) => {
      const seatNumber = seat.seatNumber;
      const row = Math.floor((seatNumber - 1) / 7);
      const col = (seatNumber - 1) % 7;
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
  const resp: any = seatsService.resetSeats();

  if (resp) {
    res.json({ success: true, message: "Seats cleared Successfully" });
    return;
  }
//   res.json({success:false,message})
};
