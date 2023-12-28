

export default async function joinLobby(lobbyCode, name) {
    // Check name
    if (name.length < 1) {
        return "Name must be at least 1 character";
    }
    if (name.length > 20) {
        return "Name must be at most 20 characters";
    }

    
}