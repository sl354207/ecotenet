/**
 * @jest-environment node
 */

import handler from "@pages/api/dashboard/comments/[id]";
import { updateComment } from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";
// jest.mock("@utils/mongodb/mongoPromise");
jest.mock("@utils/mongodb/mongoHelpers");
jest.mock("next-auth/react");

describe("dashboard comment api", () => {
  beforeEach(() => {
    jest.resetAllMocks();
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

        getSession.mockResolvedValueOnce(null);

        await handler(req, res);

        expect(getSession).toHaveBeenCalledTimes(1);
        expect(res.status.mock.calls[0][0]).toBe(401);

        // console.log(getSession.mock.results[0].value);
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

          getSession.mockResolvedValueOnce({
            user: { name: "test 1", email: "test@gmail.com", role: "user" },
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
          });

          updateComment.mockResolvedValueOnce("test method not allowed");

          await handler(req, res);
          // console.log(status.mock);

          expect(getSession).toHaveBeenCalledTimes(1);
          expect(res.status.mock.calls[0][0]).toBe(405);
          // console.log(updateComment.mock.results);
          // console.log(getSession.mock.results[0].value);
        });
      });
      describe("request method allowed", () => {
        describe("PUT", () => {
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

              getSession.mockResolvedValueOnce({
                user: { name: "test 2", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              await handler(req, res);
              // console.log(status.mock);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(updateComment).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
              // console.log(updateComment.mock.results);
              // console.log(getSession.mock.results[0].value);
            });
          });
          describe("valid data", () => {
            it("data is updated", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "32fa81eb88f30d14e512d872",
                  name: "test 3",
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

              getSession.mockResolvedValueOnce({
                user: { name: "test 3", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              updateComment.mockResolvedValueOnce("test valid data update");

              await handler(req, res);
              // console.log(res.status.mock.results[0].value.json.mock);
              // console.log(
              //   updateComment.mock.instances[0].connectToDatabase.mock
              // );
              // console.log(clientPromise());

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(updateComment).toHaveBeenCalledTimes(1);
              expect(res.status.mock.calls[0][0]).toBe(200);
              // console.log(updateComment.mock.results);
              // console.log(getSession.mock.results[0].value);

              // updateComment.mockReset();
            });
            it("database error", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "32fa81eb88f30d14e512d872",
                  name: "test 4",
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
              // updateComment.mockReset();

              getSession.mockResolvedValueOnce({
                user: { name: "test 4", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              // await updateComment.mockResolvedValueOnce(Error("test"));
              updateComment.mockImplementation(() => {
                throw new Error("test database error");
              });
              // updateComment.mockRejectedValue(new Error("test"));

              await handler(req, res);
              // console.log(
              //   res.status.mock.results[0].value.json.mock.calls[0][0]
              // );
              // console.log(updateComment.mock);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(updateComment).toHaveBeenCalledTimes(1);
              // expect(() => updateComment).toThrow(Error);
              expect(res.status.mock.calls[0][0]).toBe(500);
              // console.log(updateComment.mock.results);
              // console.log(getSession.mock.results[0].value);
            });
          });
        });
      });
    });
  });
});
