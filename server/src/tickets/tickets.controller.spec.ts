import {
	NotFoundException,
	UnprocessableEntityException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { TicketsController } from "./tickets.controller";
import { TicketsService } from "./tickets.service";

describe("TicketsController", () => {
	let controller: TicketsController;
	let ticketsService: TicketsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: TicketsService,
					useValue: {
						tickets: jest.fn(),
						ticket: jest.fn(),
						newTicket: jest.fn(),
						assign: jest.fn(),
					},
				},
			],
			controllers: [TicketsController],
		}).compile();

		controller = module.get<TicketsController>(TicketsController);
		ticketsService = module.get<TicketsService>(TicketsService); // Ensure ticketsService is assigned
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	// candidate testing

	describe("getTickets", () => {
		it("should return a list of tickets", async () => {
			const mockTickets = [
				{
					id: 1,
					description: "Test Ticket 1",
					completed: false,
					assigneeId: 2,
				},
				{
					id: 2,
					description: "Test Ticket 2",
					completed: true,
					assigneeId: 1,
				},
			];
			ticketsService.tickets = jest.fn().mockResolvedValue(mockTickets);

			const result = await controller.getTickets();
			expect(result).toEqual(mockTickets);
			expect(ticketsService.tickets).toHaveBeenCalledWith(undefined);
		});

		it("should filter tickets by completed status", async () => {
			const mockTickets = [
				{
					id: 1,
					description: "Test Ticket 1",
					completed: true,
					assigneeId: 1,
				},
			];
			ticketsService.tickets = jest.fn().mockResolvedValue(mockTickets);

			const result = await controller.getTickets("true");
			expect(result).toEqual(mockTickets);
			expect(ticketsService.tickets).toHaveBeenCalledWith(true);
		});
	});

	describe("getTicket", () => {
		it("should return a single ticket", async () => {
			const mockTicket = {
				id: 1,
				description: "Test Ticket",
				completed: false,
				assigneeId: 1,
			};
			jest.spyOn(ticketsService, "ticket").mockResolvedValue(mockTicket);

			const result = await controller.getTicket("1");
			expect(result).toEqual(mockTicket);
			expect(ticketsService.ticket).toHaveBeenCalledWith(1);
		});

		it("should throw NotFoundException if ticket is not found", async () => {
			jest.spyOn(ticketsService, "ticket").mockResolvedValue(null);

			await expect(controller.getTicket("1")).rejects.toThrow(
				NotFoundException
			);
		});

		it("should throw UnprocessableEntityException for invalid ticket ID", async () => {
			await expect(controller.getTicket("invalid-id")).rejects.toThrow(
				UnprocessableEntityException
			);
		});
	});

	describe("createTicket", () => {
		it("should create a new ticket", async () => {
			const mockTicket = {
				id: 1,
				description: "New Ticket",
				completed: false,
				assigneeId: 1,
			};
			jest.spyOn(ticketsService, "newTicket").mockResolvedValue(
				mockTicket
			);

			const result = await controller.createTicket({
				description: "New Ticket",
			});
			expect(result).toEqual(mockTicket);
			expect(ticketsService.newTicket).toHaveBeenCalledWith({
				description: "New Ticket",
			});
		});
	});

	describe("assignTicket", () => {
		it("should assign a ticket to a user", async () => {
			jest.spyOn(ticketsService, "assign").mockResolvedValue(true);

			const result = await controller.assignTicket("1", "2");
			expect(result).toBeUndefined(); // No content for 204
			expect(ticketsService.assign).toHaveBeenCalledWith(1, 2);
		});

		it("should throw UnprocessableEntityException if assignment fails", async () => {
			jest.spyOn(ticketsService, "assign").mockResolvedValue(false);

			await expect(controller.assignTicket("1", "2")).rejects.toThrow(
				UnprocessableEntityException
			);
		});

		it("should throw UnprocessableEntityException for invalid user ID", async () => {
			await expect(
				controller.assignTicket("1", "invalid-id")
			).rejects.toThrow(UnprocessableEntityException);
		});
	});
});
