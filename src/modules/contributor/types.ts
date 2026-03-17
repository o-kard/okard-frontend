import { Campaign } from "../campaign/types/campaign";

export interface Contributor {
    id: string;
    user_id: string;
    campaign_id: string;
    total_amount: number;
    updated_at: string;
}

export interface ContributorWithCampaign extends Contributor {
    campaign: Campaign;
}
