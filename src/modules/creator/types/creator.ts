export enum VerificationStatus {
    pending = "pending",
    verified = "verified",
    rejected = "rejected",
}

export interface SocialLink {
    platform: string;
    url: string;
}

export interface CreatorVerificationDoc {
    id: string;
    creator_id: string;
    type: string;
    file_path: string;
    storage_provider: string;
    mime_type: string | null;
    file_size: number | null;
    uploaded_at: string;
    verified_at: string | null;
    verified_by: string | null;
}

export interface Creator {
    id: string;
    user_id: string;
    display_name_override: string | null;
    bio: string | null;
    campaign_number: number;
    social_links: SocialLink[] | null;
    verification_status: VerificationStatus;
    verification_submitted_at: string | null;
    verified_at: string | null;
    verified_by: string | null;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
    verification_docs: CreatorVerificationDoc[];
}

export interface CreatorFormData {
    display_name_override: string;
    bio: string;
    social_links: SocialLink[];
}

export interface CreatorFormFiles {
    id_card?: File | null;
    house_registration?: File | null;
    bank_statement?: File | null;
}
