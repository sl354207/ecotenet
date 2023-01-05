/**
 * @jest-environment node
 */

import handler from "@pages/api/dashboard/users/[name]";
import {
  deletePerson,
  getPerson,
  updatePerson,
} from "@utils/mongodb/mongoHelpers";
import { getSession } from "next-auth/react";
// jest.mock("@utils/mongodb/mongoPromise");
jest.mock("@utils/mongodb/mongoHelpers");
jest.mock("next-auth/react");

describe("dashboard name api", () => {
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
        it("should deny GET request", async () => {
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

          updatePerson.mockResolvedValueOnce("test method not allowed");

          await handler(req, res);

          expect(getSession).toHaveBeenCalledTimes(1);
          expect(updatePerson).toHaveBeenCalledTimes(0);
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
                  name: "test",
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
              expect(updatePerson).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
            });
            it("should deny invalid data", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  email: "62fa81eb88f30d14e512d87",
                  name: "test",
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
              expect(updatePerson).toHaveBeenCalledTimes(0);
              expect(res.status.mock.calls[0][0]).toBe(403);
            });
            it("should deny additional fields", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  email: "test@test.com",
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
              expect(updatePerson).toHaveBeenCalledTimes(0);
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
                  email: "test@gmail.com",
                  name: "test 3",
                  emailVerified: "2022-08-16T19:06:55.405+00:00",
                  bio: "test",
                  approved: "pending",
                  website: "test",
                  socials: [],
                  denials: 0,
                  role: "user",
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

              updatePerson.mockResolvedValueOnce("test valid data update");

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              //   expect(updatePerson).toHaveBeenCalledTimes(1);
              expect(res.status.mock.calls[0][0]).toBe(200);
            });

            it("database error", async () => {
              const req = {
                method: "PUT", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: {
                  email: "test@gmail.com",
                  name: "test 4",
                  emailVerified: "2022-08-16T19:06:55.405+00:00",
                  bio: "test",
                  approved: "pending",
                  website: "test",
                  socials: [],
                  denials: 0,
                  role: "user",
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

              updatePerson.mockImplementation(() => {
                throw new Error("test database error");
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(updatePerson).toHaveBeenCalledTimes(1);

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
                body: {},
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
              expect(deletePerson).toHaveBeenCalledTimes(0);
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
                body: "test 3",
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

              deletePerson.mockResolvedValueOnce("test valid data update");

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(deletePerson).toHaveBeenCalledTimes(1);
              expect(res.status.mock.calls[0][0]).toBe(200);
            });

            it("database error", async () => {
              const req = {
                method: "DELETE", // GET, POST, PUT, DELETE, OPTIONS, etc.
                headers: {
                  "content-type": "application/json",
                },
                body: "test 4",
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

              deletePerson.mockImplementation(() => {
                throw new Error("test database error");
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(deletePerson).toHaveBeenCalledTimes(1);

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
              expect(getPerson).toHaveBeenCalledTimes(0);
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

              getPerson.mockResolvedValueOnce("test valid data update");

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(getPerson).toHaveBeenCalledTimes(1);
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

              getPerson.mockImplementation(() => {
                throw new Error("test database error");
              });

              await handler(req, res);

              expect(getSession).toHaveBeenCalledTimes(1);
              expect(getPerson).toHaveBeenCalledTimes(1);

              expect(res.status.mock.calls[0][0]).toBe(500);
            });
          });
        });
      });
    });
  });
});
