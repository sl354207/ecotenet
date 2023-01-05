/**
 * @jest-environment node
 */

import handler from "@pages/api/dashboard/posts/[id]";
import { deletePost, updatePost } from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";
// jest.mock("@utils/mongodb/mongoPromise");
jest.mock("@utils/mongodb/mongoHelpers");
jest.mock("next-auth/react");

describe("dashboard post api", () => {
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
        it("should deny POST request", async () => {
          const req = {
            method: "POST", // GET, POST, PUT, DELETE, OPTIONS, etc.
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

          updatePost.mockResolvedValueOnce("test method not allowed");

          await handler(req, res);

          expect(getSession).toHaveBeenCalledTimes(1);
          expect(res.status.mock.calls[0][0]).toBe(405);
        });
      });
      describe("request method allowed", () => {
        describe("PUT", () => {
          describe("invalid data", () => {
            it("should deny invalid data", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  name: "test",

                  updated: "true",
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
              expect(updatePost).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
            });
            it("should deny additional fields", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  name: "test",

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
              expect(updatePost).toHaveBeenCalledTimes(0);
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
                  _id: "62fa81eb88f30d14e512d872",
                  title: "",
                  description: "",
                  category: "",
                  tags: [],
                  ecoregions: [],
                  id: "",
                  name: "test 3",
                  status: "draft",
                  approved: "false",
                  updated: false,
                  featured: false,
                  feature: "false",
                  date: "",
                  version: 1,
                  rows: [],
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

              updatePost.mockResolvedValueOnce("test valid data update");

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              //   expect(updatePost).toHaveBeenCalledTimes(1);
              expect(res.status.mock.calls[0][0]).toBe(200);
            });

            it("database error", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  _id: "62fa81eb88f30d14e512d872",
                  title: "",
                  description: "",
                  category: "",
                  tags: [],
                  ecoregions: [],
                  id: "",
                  name: "test 4",
                  status: "draft",
                  approved: "false",
                  updated: false,
                  featured: false,
                  feature: "false",
                  date: "",
                  version: 1,
                  rows: [],
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

              updatePost.mockImplementation(() => {
                throw new Error("test database error");
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(updatePost).toHaveBeenCalledTimes(1);

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
                  _id: "62fa81eb88f30d14e512d872",
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

              getSession.mockResolvedValueOnce({
                user: { name: "test 2", email: "test@gmail.com", role: "user" },
                expires: new Date(Date.now() + 2 * 86400).toISOString(),
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(deletePost).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
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
                  _id: "62fa81eb88f30d14e512d872",
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

              deletePost.mockResolvedValueOnce("test valid data update");

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(deletePost).toHaveBeenCalledTimes(1);
              expect(res.status.mock.calls[0][0]).toBe(200);
            });

            it("database error", async () => {
              const req = {
                method: "DELETE", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  _id: "62fa81eb88f30d14e512d872",
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

              deletePost.mockImplementation(() => {
                throw new Error("test database error");
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(deletePost).toHaveBeenCalledTimes(1);

              expect(res.status.mock.calls[0][0]).toBe(500);
            });
          });
        });
      });
    });
  });
});
