/**
 * @jest-environment node
 */

import handler from "@pages/api/dashboard/comments/[id]";
import { deleteComment, updateComment } from "@utils/mongodb/mongoHelpers";
import { getServerSession } from "next-auth/next";
jest.mock("next-auth/next");

jest.mock("@utils/mongodb/mongoHelpers");

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

        getServerSession.mockResolvedValueOnce(null);

        await handler(req, res);

        expect(getServerSession).toHaveBeenCalledTimes(1);
        expect(res.status.mock.calls[0][0]).toBe(401);
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

          getServerSession.mockResolvedValueOnce({
            user: { name: "test 1", email: "test@gmail.com", role: "user" },
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
          });

          updateComment.mockResolvedValueOnce("test method not allowed");

          await handler(req, res);

          expect(getServerSession).toHaveBeenCalledTimes(1);
          expect(res.status.mock.calls[0][0]).toBe(405);
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

              getServerSession.mockResolvedValueOnce({
                user: { name: "test 2", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              await handler(req, res);

              expect(getServerSession).toHaveBeenCalledTimes(1);
              expect(updateComment).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
            });
            it("should deny invalid data", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "62fa81eb88f30d14e512d87",
                  name: "test",
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

              getServerSession.mockResolvedValueOnce({
                user: { name: "test 2", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              await handler(req, res);

              expect(getServerSession).toHaveBeenCalledTimes(1);
              expect(updateComment).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
            });
            it("should deny additional fields", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "62fa81eb88f30d14e512d87",
                  name: "test",
                  text: "test",
                  approved: "pending",
                  updated: true,
                  test_field: "test",
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

              getServerSession.mockResolvedValueOnce({
                user: { name: "test 2", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              await handler(req, res);

              expect(getServerSession).toHaveBeenCalledTimes(1);
              expect(updateComment).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
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

              getServerSession.mockResolvedValueOnce({
                user: { name: "test 3", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              updateComment.mockResolvedValueOnce("test valid data update");

              await handler(req, res);

              expect(getServerSession).toHaveBeenCalledTimes(1);
              expect(updateComment).toHaveBeenCalledTimes(1);
              expect(res.status.mock.calls[0][0]).toBe(200);
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

              getServerSession.mockResolvedValueOnce({
                user: { name: "test 4", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              updateComment.mockImplementation(() => {
                throw new Error("test database error");
              });

              await handler(req, res);

              expect(getServerSession).toHaveBeenCalledTimes(1);
              expect(updateComment).toHaveBeenCalledTimes(1);

              expect(res.status.mock.calls[0][0]).toBe(500);
            });
          });
        });
        describe("DELETE", () => {
          describe("invalid data", () => {
            it("should deny invalid data", async () => {
              const req = {
                method: "DELETE", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "62fa81eb88f30d14e512d872",
                  name: {},
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

              getServerSession.mockResolvedValueOnce({
                user: { name: "test 2", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              await handler(req, res);

              expect(getServerSession).toHaveBeenCalledTimes(1);
              expect(deleteComment).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(401);
            });
          });
          describe("valid data", () => {
            it("data is deleted", async () => {
              const req = {
                method: "DELETE", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "62fa81eb88f30d14e512d872",
                  name: "test 3",
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

              getServerSession.mockResolvedValueOnce({
                user: { name: "test 3", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              deleteComment.mockResolvedValueOnce("test valid data update");

              await handler(req, res);

              expect(getServerSession).toHaveBeenCalledTimes(1);
              expect(deleteComment).toHaveBeenCalledTimes(1);
              expect(res.status.mock.calls[0][0]).toBe(200);
            });

            it("database error", async () => {
              const req = {
                method: "DELETE", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "62fa81eb88f30d14e512d872",
                  name: "test 4",
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

              getServerSession.mockResolvedValueOnce({
                user: { name: "test 4", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              deleteComment.mockImplementation(() => {
                throw new Error("test database error");
              });

              await handler(req, res);

              expect(getServerSession).toHaveBeenCalledTimes(1);
              expect(deleteComment).toHaveBeenCalledTimes(1);

              expect(res.status.mock.calls[0][0]).toBe(500);
            });
          });
        });
      });
    });
  });
});
