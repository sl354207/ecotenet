/**
 * @jest-environment node
 */

import handler from "@pages/api/dashboard/posts/index";
import { createPost, getDashboardPosts } from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";

jest.mock("@utils/mongodb/mongoHelpers");
jest.mock("next-auth/react");

describe("dashboard posts api", () => {
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

          createPost.mockResolvedValueOnce("test method not allowed");

          await handler(req, res);

          expect(getSession).toHaveBeenCalledTimes(1);
          expect(res.status.mock.calls[0][0]).toBe(405);
        });
      });
      describe("request method allowed", () => {
        describe("POST", () => {
          describe("invalid data", () => {
            it("should deny invalid data", async () => {
              const req = {
                method: "POST", // GET, POST, PUT, DELETE, OPTIONS, etc.
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
              expect(getDashboardPosts).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
            });
            it("should deny additional fields", async () => {
              const req = {
                method: "POST", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  name: "test",

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
              expect(createPost).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
            });
          });
          describe("valid data", () => {
            it("post is created", async () => {
              const req = {
                method: "POST", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },

                body: {
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

              createPost.mockResolvedValueOnce("test valid data update");

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(createPost).toHaveBeenCalledTimes(1);
              expect(res.status.mock.calls[0][0]).toBe(200);
            });

            it("database error", async () => {
              const req = {
                method: "POST", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
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

              createPost.mockImplementation(() => {
                throw new Error("test database error");
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(createPost).toHaveBeenCalledTimes(1);

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
                  status: "draft",
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
              expect(getDashboardPosts).toHaveBeenCalledTimes(0);
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
                  status: "draft",
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

              getDashboardPosts.mockResolvedValueOnce("test valid data update");

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(getDashboardPosts).toHaveBeenCalledTimes(1);
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
                  status: "draft",
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

              getDashboardPosts.mockImplementation(() => {
                throw new Error("test database error");
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(getDashboardPosts).toHaveBeenCalledTimes(1);

              expect(res.status.mock.calls[0][0]).toBe(500);
            });
          });
        });
      });
    });
  });
});
