/**
 * @jest-environment node
 */

import handler from "@pages/api/dashboard/comments/[id]";
import {
  checkPerson,
  deleteComment,
  updateComment,
} from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";
jest.mock("@utils/mongodb/mongoHelpers");
jest.mock("next-auth/react");

// jest.mock("next-auth/react", () => {
//   const originalModule = jest.requireActual("next-auth/react");
//   const mockSession = {
//     user: { name: 'test', email: 'test@gmail.com', role: 'user' },
//     expires: new Date(Date.now() + 2 * 86400).toISOString(),
//   };

// RETURN VALUE OF SUCCESSFUL GETSESSION
// {
//   user: { name: 'Muskrat', email: 'stefanslombard@gmail.com', role: 'admin' },
//   expires: '2023-01-20T20:08:14.617Z'
// }
// {
//   acknowledged: true,
//   modifiedCount: 1,
//   upsertedId: null,
//   upsertedCount: 0,
//   matchedCount: 1
// }

//   return {
//     __esModule: true,
//     ...originalModule,
//     getSession: jest.fn(() => {
//       return { data: mockSession, status: "unauthenticated" }; // return type is [] in v3 but changed to {} in v4
//     }),
//   };
// });

describe("dashboard comment api", () => {
  beforeEach(() => {
    getSession.mockClear();
    // updateComment.mockClear();
  });
  describe("authorization", () => {
    describe("unauthorized", () => {
      it("should deny unauthorized user", async () => {
        const req = {
          method: "GET", // GET, POST, PUT, DELETE, OPTIONS, etc.
          headers: {
            "content-type": "application/json",
          },
        };
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

        getSession.mockReturnValueOnce(null);
        // getSession.mockReturnValueOnce([
        //   {
        //     expires: new Date(Date.now() + 2 * 86400).toISOString(),
        //     user: { username: "test" },
        //   },
        //   false,
        // ]);
        // console.log(status.mock);

        await handler(req, res);

        expect(getSession).toHaveBeenCalledTimes(1);
        expect(res.status.mock.calls[0][0]).toBe(401);
        json.mockClear();
        end.mockClear();
        setHeader.mockClear();
        status.mockClear();
        // console.log(status.mock);
        updateComment.mockClear();
      });
    });
    describe("authorized", () => {
      describe("request method not allowed", () => {
        it("should deny GET request", async () => {
          const req = {
            method: "GET", // GET, POST, PUT, DELETE, OPTIONS, etc.
            headers: {
              "content-type": "application/json",
            },
          };
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

          getSession.mockReturnValueOnce({
            user: { name: "test", email: "test@gmail.com", role: "user" },
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
          });

          deleteComment.mockReturnValueOnce("test");
          updateComment.mockReturnValueOnce("test");
          checkPerson.mockReturnValueOnce("test");

          await handler(req, res);
          // console.log(status.mock);

          expect(getSession).toHaveBeenCalledTimes(1);
          expect(res.status.mock.calls[0][0]).toBe(405);
          json.mockClear();
          end.mockClear();
          setHeader.mockClear();
          status.mockClear();
          // console.log(status.mock);
          updateComment.mockClear();
          // updateComment.mockClear();
        });
      });
      describe("request method allowed", () => {
        describe("PUT", () => {
          // beforeEach(() => {
          //   getSession.mockClear();
          //   updateComment.mockClear();
          // });
          describe("invalid data", () => {
            it("should deny missing required data", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "62fa81eb88f30d14e512d873",
                  // name: 'test',
                  date: new Date().toUTCString(),
                  text: "test",
                  approved: "pending",
                  updated: true,
                },
              };
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

              getSession.mockReturnValueOnce({
                user: { name: "test", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              // deleteComment.mockReturnValueOnce("test");
              // updateComment.mockReturnValueOnce("tnt");
              // checkPerson.mockReturnValueOnce("test");

              await handler(req, res);
              // console.log(status.mock);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(updateComment).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
              json.mockClear();
              end.mockClear();
              setHeader.mockClear();
              status.mockClear();
              // console.log(status.mock);
              updateComment.mockClear();
            });
          });
          describe("valid data", () => {
            // beforeEach(() => {
            //   getSession.mockClear();
            //   updateComment.mockClear();
            // });
            it("data is updated", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "32fa81eb88f30d14e512d872",
                  name: "test",
                  date: new Date().toUTCString(),
                  text: "test",
                  approved: "pending",
                  updated: true,
                },
              };
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

              getSession.mockReturnValueOnce({
                user: { name: "test", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              // deleteComment.mockReturnValueOnce("test");
              updateComment.mockReturnValueOnce("tst");
              // checkPerson.mockReturnValueOnce("test");

              await handler(req, res);
              // console.log(res.status.mock.results[0].value.json.mock);
              // console.log(status.mock);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(updateComment).toHaveBeenCalledTimes(1);
              expect(res.status.mock.calls[0][0]).toBe(200);
              // expect(
              //   res.status.mock.results[0].value.json.mock.calls[0][0]
              // ).toMatch(/row/);
              json.mockClear();
              end.mockClear();
              setHeader.mockClear();
              status.mockClear();
              // console.log(status.mock);
              updateComment.mockClear();
              console.log(updateComment.mock);
            });
            it("database error", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "32fa81eb88f30d14e512d872",
                  name: "test",
                  date: new Date().toUTCString(),
                  text: "test",
                  approved: "pending",
                  updated: true,
                },
              };
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
              updateComment.mockClear();

              getSession.mockReturnValueOnce({
                user: { name: "test", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              // deleteComment.mockReturnValueOnce("test");
              updateComment.mockReturnValueOnce(Error("test"));
              // updateComment.mockImplementation(() => {
              //   throw new Error("test");
              // });
              // updateComment.mockRejectedValue(new Error("test"));
              // checkPerson.mockReturnValueOnce("test");

              await handler(req, res);
              // console.log(
              //   res.status.mock.results[0].value.json.mock.calls[0][0]
              // );
              console.log(updateComment.mock);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(updateComment).toHaveBeenCalledTimes(1);
              // expect(() => updateComment).toThrow(Error);
              expect(res.status.mock.calls[0][0]).toBe(500);
              // expect(
              //   res.status.mock.results[0].value.json.mock.calls[0][0]
              // ).toMatch(/row/);
              json.mockClear();
              end.mockClear();
              setHeader.mockClear();
              status.mockClear();
            });
          });
        });
      });
    });
  });
});
