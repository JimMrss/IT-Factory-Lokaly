
export const Client = () => {
    return {
        user_id: Number,
        identifier: String,
        name: String,
        surname: String,
        description: String,
        groups: [] as number[],
        activities: [] as number[]
    }
}
export const Group = () => {
    return {
        group_id: Number,
        name: String,
        description: String,
        members: [] as number[],
        annonces: [] as number[]
    }
}
export const Annonce = () => {
    return {
        annonce_id: Number,
        name: String,
        interested_users: [] as number[],
        date: String,
        hour: String,
        description: String,
        location: String,
        state: String
    }
}
export const Evenement = () => {
    return {
        evenement_id: Number,
        name: String,
        date: String,
        hour: String,
        description: String,
        location: String,
        provider: Number
    }
}