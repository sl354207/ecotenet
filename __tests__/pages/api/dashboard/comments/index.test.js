/**
 * @jest-environment node
 */

import handler from "@pages/api/dashboard/comments/index";
import {
  createComment,
  getDashboardComments,
} from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";

jest.mock("@utils/mongodb/mongoHelpers");
jest.mock("next-auth/react");

describe("dashboard comments api", () => {
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
      });
    });
    describe("authorized", () => {
      describe("request method not allowed", () => {
        it("should deny PUT request", async () => {
          const req = {
            method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
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

          createComment.mockResolvedValueOnce("test method not allowed");

          await handler(req, res);

          expect(getSession).toHaveBeenCalledTimes(1);
          expect(res.status.mock.calls[0][0]).toBe(405);
        });
      });
      describe("request method allowed", () => {
        describe("POST", () => {
          describe("invalid data", () => {
            it("should deny missing required data", async () => {
              const req = {
                method: "POST", // GET, POST, PUT, DELETE, OPTIONS, etc.
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

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(createComment).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
            });
            it("should deny invalid data", async () => {
              const req = {
                method: "POST", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "62fa81eb88f30d14e512d87",
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

              getSession.mockResolvedValueOnce({
                user: { name: "test 2", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(getDashboardComments).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
            });
            it("should deny additional fields", async () => {
              const req = {
                method: "POST", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  id: "62fa81eb88f30d14e512d87",
                  name: "test",
                  date: new Date().toUTCString(),
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

              getSession.mockResolvedValueOnce({
                user: { name: "test 2", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(createComment).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
            });
          });
          describe("valid data", () => {
            it("comment is created", async () => {
              const req = {
                method: "POST", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  post_id: "32fa81eb88f30d14e512d872",
                  comment_ref: "",
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

              createComment.mockResolvedValueOnce("test valid data update");

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(createComment).toHaveBeenCalledTimes(1);
              expect(res.status.mock.calls[0][0]).toBe(200);
            });

            it("database error", async () => {
              const req = {
                method: "POST", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  post_id: "32fa81eb88f30d14e512d872",
                  comment_ref: "",
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

              getSession.mockResolvedValueOnce({
                user: { name: "test 4", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              createComment.mockImplementation(() => {
                throw new Error("test database error");
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(createComment).toHaveBeenCalledTimes(1);

              expect(res.status.mock.calls[0][0]).toBe(500);
            });
          });
        });
        describe("GET", () => {
          describe("invalid data", () => {
            it("should deny invalid data", async () => {
              const req = {
                method: "GET", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                query: {
                  name: { $ne: -1 },
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

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(getDashboardComments).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
            });
          });
          describe("valid data", () => {
            it("data is retrieved", async () => {
              const req = {
                method: "GET", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                query: {
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

              getSession.mockResolvedValueOnce({
                user: { name: "test 3", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              getDashboardComments.mockResolvedValueOnce(
                "test valid data update"
              );

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(getDashboardComments).toHaveBeenCalledTimes(1);
              expect(res.status.mock.calls[0][0]).toBe(200);
            });

            it("database error", async () => {
              const req = {
                method: "GET", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                query: {
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

              getSession.mockResolvedValueOnce({
                user: { name: "test 4", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              getDashboardComments.mockImplementation(() => {
                throw new Error("test database error");
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(getDashboardComments).toHaveBeenCalledTimes(1);

              expect(res.status.mock.calls[0][0]).toBe(500);
            });
          });
        });
      });
    });
  });
});
