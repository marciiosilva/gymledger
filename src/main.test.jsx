import { describe, expect, it, vi } from "vitest";

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock("react-dom/client", () => ({
  default: {
    createRoot: createRootMock
  }
}));

describe("main", () => {
  it("inicializa a aplicacao no elemento root", async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import("./main.jsx");

    expect(createRootMock).toHaveBeenCalledWith(document.getElementById("root"));
    expect(renderMock).toHaveBeenCalledTimes(1);
  });
});
