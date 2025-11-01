export type Player = {
	id: string;
	name: string;
	score: number;
	createdAt: number;
};

export type AppState = {
	players: Player[];
};


