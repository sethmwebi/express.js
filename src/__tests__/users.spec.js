import { getUserByIdHandler } from "../handlers/users.mjs";
import { mockUsers } from "../utils/constants.mjs";

const mockRequest = {
  findUserIndex: 1,
};

const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
};

describe("get users", () => {
  it("should get user by id", () => {
    getUserByIdHandler(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalled()
    expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[1])
  });
});
