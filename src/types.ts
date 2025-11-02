export type Player = {
	id: string;
	name: string;
	score: number;
	createdAt: number;
	pendingDelta?: number;
	revealed?: boolean;
};

export type AppState = {
	players: Player[];
	hideTotals: boolean;
};


