import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home Component", () => {
	it("renders correctly", () => {
		render(<Home />);
		expect(screen.getByText("Open")).toBeInTheDocument();
	});
});
