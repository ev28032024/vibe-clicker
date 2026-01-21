// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VibeTapLeaderboard
 * @dev On-chain leaderboard for VibeTap game on Base
 * @notice Stores player scores and provides leaderboard queries
 */
contract VibeTapLeaderboard {
    struct Player {
        uint256 score;
        uint256 totalClicks;
        uint256 lastUpdate;
        bool exists;
    }
    
    mapping(address => Player) public players;
    address[] public playerList;
    
    // Events
    event ScoreSubmitted(address indexed player, uint256 score, uint256 totalClicks);
    event NewPlayer(address indexed player);
    
    /**
     * @dev Submit or update player score
     * @param newScore The player's current score
     * @param newTotalClicks The player's total click count
     */
    function submitScore(uint256 newScore, uint256 newTotalClicks) external {
        Player storage player = players[msg.sender];
        
        // Add to player list if new
        if (!player.exists) {
            playerList.push(msg.sender);
            player.exists = true;
            emit NewPlayer(msg.sender);
        }
        
        // Only update if score is higher (prevent cheating by lowering score)
        if (newScore > player.score) {
            player.score = newScore;
            player.totalClicks = newTotalClicks;
            player.lastUpdate = block.timestamp;
            
            emit ScoreSubmitted(msg.sender, newScore, newTotalClicks);
        }
    }
    
    /**
     * @dev Get player data
     * @param playerAddress Address of the player
     * @return score Player's score
     * @return totalClicks Player's total clicks
     * @return lastUpdate Last update timestamp
     */
    function getPlayer(address playerAddress) external view returns (
        uint256 score,
        uint256 totalClicks,
        uint256 lastUpdate
    ) {
        Player storage player = players[playerAddress];
        return (player.score, player.totalClicks, player.lastUpdate);
    }
    
    /**
     * @dev Get total number of players
     * @return Total player count
     */
    function getPlayerCount() external view returns (uint256) {
        return playerList.length;
    }
    
    /**
     * @dev Get top players sorted by score (off-chain sorting recommended for gas efficiency)
     * @param offset Starting index
     * @param limit Maximum number of players to return
     * @return addresses Array of player addresses
     * @return scores Array of corresponding scores
     */
    function getPlayers(uint256 offset, uint256 limit) external view returns (
        address[] memory addresses,
        uint256[] memory scores
    ) {
        uint256 total = playerList.length;
        
        if (offset >= total) {
            return (new address[](0), new uint256[](0));
        }
        
        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }
        
        uint256 count = end - offset;
        addresses = new address[](count);
        scores = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            address addr = playerList[offset + i];
            addresses[i] = addr;
            scores[i] = players[addr].score;
        }
        
        return (addresses, scores);
    }
    
    /**
     * @dev Get all players for off-chain sorting (use with caution for large player counts)
     * @return addresses Array of all player addresses
     * @return scores Array of all scores
     */
    function getAllPlayers() external view returns (
        address[] memory addresses,
        uint256[] memory scores
    ) {
        uint256 total = playerList.length;
        addresses = new address[](total);
        scores = new uint256[](total);
        
        for (uint256 i = 0; i < total; i++) {
            address addr = playerList[i];
            addresses[i] = addr;
            scores[i] = players[addr].score;
        }
        
        return (addresses, scores);
    }
}
