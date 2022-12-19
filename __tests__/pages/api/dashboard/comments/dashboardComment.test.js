/**
 * @jest-environment node
 */

// jest.mock("@pages/api/dashboard/comments/[id].js");
import handler from "@pages/api/dashboard/comments/[id]";
import { getSession } from "next-auth/react";
jest.mock("next-auth/react");

// import {
//   checkPerson,
//   deleteComment,
//   updateComment,
// } from "@utils/mongodb/mongoHelpers";

// const mockUseSession = getSession;

// jest.mock("deleteComment");
// jest.mock("checkPerson");
// jest.mock("getSession");

describe("dashboard comment api", () => {
  //   console.log(updateComment);
  //   console.log(deleteComment);
  //   console.log(checkPerson);
  //   console.log(getSession);
  it("should insert a doc into collection", async () => {
    const req = {
      method: "GET", // GET, POST, PUT, DELETE, OPTIONS, etc.

      headers: {
        "content-type": "application/json",
      },
    };
    // getSession = jest.fn();
    getSession.mockReturnValue([
      {
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
        user: { username: "test" },
      },
      "unauthenticated",
    ]);
    const deleteComment = jest.fn();
    const updateComment = jest.fn();
    const checkPerson = jest.fn();
    // const getSession = jest.fn();

    const json = jest.fn();
    const end = jest.fn();
    const setHeader = jest.fn();

    const status = jest.fn(() => {
      return {
        json,
        end,
      };
    });

    const res = {
      status,
      end,
      setHeader,
    };

    // const thing = await handler(req, res);
    //
    console.log(handler(req, res));
  });
});
