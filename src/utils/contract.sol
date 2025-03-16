// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract OmotenashiPassport is ERC721Enumerable, Ownable {
    using Strings for uint256;

    struct Location {
        string name;
        string description;
        string stampSvg;
    }

    struct Passport {
        string[] visitedLocations;
        uint256 adventurerLevel;
        bool[] perksUnlocked;
    }

    // Maps tokenId to passport data
    mapping(uint256 => Passport) public passports;
    
    // Available locations that can be visited
    mapping(string => Location) public locations;
    
    // Location codes for validation
    mapping(string => string) private locationCodes;

    // Base SVG for the passport
    string private basePassportSvg;
    
    // Available perks
    string[] public perks;
    
    // Counter for tokenIds
    uint256 private _tokenIdCounter;

    constructor() ERC721("Omotenashi Passport", "OMOTENASHI") Ownable(msg.sender) {
        // Set base passport SVG
        basePassportSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f8e8d4"/><text x="200" y="30" font-family="Arial" font-size="20" text-anchor="middle" fill="#8B4513">Omotenashi Passport</text><rect x="20" y="50" width="360" height="230" fill="#fffaf0" stroke="#8B4513" stroke-width="2"/></svg>';
        
        // Add some initial locations
        _addLocation(
            "Fushimi Inari Shrine", 
            "Home to 10,000 torii gates",
            '<svg width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="none"/><path d="M40 10 L60 30 L55 30 L55 50 L60 50 L40 70 L20 50 L25 50 L25 30 L20 30 Z" fill="#E84D39" stroke="#000" stroke-width="1"/><text x="40" y="78" font-size="8" text-anchor="middle">Fushimi Inari</text></svg>',
            "FSH123"
        );
        
        _addLocation(
            "Local Soba Shop", 
            "Family-run for 5 generations",
            '<svg width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="none"/><circle cx="40" cy="30" r="15" fill="#F9E9BA" stroke="#000"/><path d="M30 35 Q40 55 50 35" stroke="#634C27" stroke-width="2" fill="none"/><text x="40" y="78" font-size="8" text-anchor="middle">Soba Shop</text></svg>',
            "SOB456"
        );
        
        _addLocation(
            "Hidden Onsen", 
            "Secret hot spring with mountain views",
            '<svg width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="none"/><circle cx="40" cy="40" r="20" fill="#A7D5E3" stroke="#000"/><path d="M30 40 Q40 30 50 40 Q60 50 40 60 Q20 50 30 40" fill="#85C1D3" stroke="#000"/><text x="40" y="78" font-size="8" text-anchor="middle">Hidden Onsen</text></svg>',
            "ONS789"
        );
        
        // Add perks
        perks.push("10% off matcha at local cafe");
        perks.push("Free onsen visit");
        perks.push("Exclusive traditional souvenir");
    }
    
    function _addLocation(string memory name, string memory description, string memory stampSvg, string memory code) internal {
        locations[name] = Location(name, description, stampSvg);
        locationCodes[code] = name;
    }
    
    function mintPassport() public {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(msg.sender, tokenId);
        
        // Initialize empty passport
        passports[tokenId].adventurerLevel = 1;
        
        // Initialize perks array (all false)
        passports[tokenId].perksUnlocked = new bool[](perks.length);
    }
    
    function addStamp(uint256 tokenId, string memory locationCode) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not approved or owner");
        require(bytes(locationCodes[locationCode]).length > 0, "Invalid location code");
        
        string memory locationName = locationCodes[locationCode];
        
        // Check if location already visited
        bool alreadyVisited = false;
        for (uint i = 0; i < passports[tokenId].visitedLocations.length; i++) {
            if (keccak256(bytes(passports[tokenId].visitedLocations[i])) == keccak256(bytes(locationName))) {
                alreadyVisited = true;
                break;
            }
        }
        require(!alreadyVisited, "Location already visited");
        
        // Add location to visited locations
        passports[tokenId].visitedLocations.push(locationName);
        
        // Update adventurer level based on number of visited locations
        passports[tokenId].adventurerLevel = 1 + passports[tokenId].visitedLocations.length / 2;
        
        // Unlock perks based on adventurer level
        if (passports[tokenId].adventurerLevel >= 2) {
            passports[tokenId].perksUnlocked[0] = true;
        }
        if (passports[tokenId].adventurerLevel >= 3) {
            passports[tokenId].perksUnlocked[1] = true;
        }
        if (passports[tokenId].adventurerLevel >= 4) {
            passports[tokenId].perksUnlocked[2] = true;
        }
    }
    
    // Helper function to check if a token exists
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        return (ERC721._isAuthorized(ownerOf(tokenId), spender, tokenId));
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        Passport memory passport = passports[tokenId];
        
        // Generate full SVG with stamps
        string memory fullSvg = generateFullSvg(tokenId);
        
        // Generate perks string
        string memory perksString = "";
        for (uint i = 0; i < passport.perksUnlocked.length; i++) {
            if (passport.perksUnlocked[i]) {
                if (bytes(perksString).length > 0) {
                    perksString = string(abi.encodePacked(perksString, ", ", perks[i]));
                } else {
                    perksString = perks[i];
                }
            }
        }
        
        // Create JSON metadata
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Omotenashi Passport #', 
                        tokenId.toString(), 
                        '", "description": "A digital passport that evolves as you explore hidden gems in Japan.", ',
                        '"attributes": [{"trait_type": "Adventurer Level", "value": ', 
                        passport.adventurerLevel.toString(),
                        '}, {"trait_type": "Places Visited", "value": ', 
                        uint256(passport.visitedLocations.length).toString(),
                        '}, {"trait_type": "Perks Unlocked", "value": "', 
                        perksString,
                        '"}], "image": "data:image/svg+xml;base64,', 
                        Base64.encode(bytes(fullSvg)), 
                        '"}'
                    )
                )
            )
        );
        
        return string(abi.encodePacked("data:application/json;base64,", json));
    }
    
    // Helper function to check if a token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    function generateFullSvg(uint256 tokenId) internal view returns (string memory) {
        Passport memory passport = passports[tokenId];
        
        // Start with base passport
        string memory svg = basePassportSvg;
        
        // Insert before closing tag
        uint256 closeTagPos = bytes(svg).length - 6; // "</svg>"
        
        // Add adventurer level
        svg = string(
            abi.encodePacked(
                substring(svg, 0, closeTagPos),
                '<text x="200" y="45" font-family="Arial" font-size="14" text-anchor="middle" fill="#8B4513">',
                'Adventurer Level: ', 
                passport.adventurerLevel.toString(),
                '</text>'
            )
        );
        
        // Add stamps for visited locations
        uint xPos = 40;
        uint yPos = 100;
        
        for (uint i = 0; i < passport.visitedLocations.length; i++) {
            Location memory loc = locations[passport.visitedLocations[i]];
            
            svg = string(
                abi.encodePacked(
                    svg,
                    '<g transform="translate(', 
                    uint256(xPos).toString(), 
                    ', ', 
                    uint256(yPos).toString(), 
                    ')">', 
                    loc.stampSvg, 
                    '</g>'
                )
            );
            
            // Adjust position for next stamp
            xPos += 100;
            if (xPos > 300) {
                xPos = 40;
                yPos += 100;
            }
        }
        
        // Close SVG
        svg = string(abi.encodePacked(svg, '</svg>'));
        
        return svg;
    }
    
    function substring(string memory str, uint startIndex, uint endIndex) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }
    
    function getVisitedLocations(uint256 tokenId) public view returns (string[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return passports[tokenId].visitedLocations;
    }
    
    function getUnlockedPerks(uint256 tokenId) public view returns (string[] memory) {
        require(_exists(tokenId), "Token does not exist");
        
        // Count unlocked perks
        uint256 count = 0;
        for (uint i = 0; i < passports[tokenId].perksUnlocked.length; i++) {
            if (passports[tokenId].perksUnlocked[i]) {
                count++;
            }
        }
        
        // Create array of unlocked perks
        string[] memory unlockedPerks = new string[](count);
        uint256 index = 0;
        for (uint i = 0; i < passports[tokenId].perksUnlocked.length; i++) {
            if (passports[tokenId].perksUnlocked[i]) {
                unlockedPerks[index] = perks[i];
                index++;
            }
        }
        
        return unlockedPerks;
    }
    
    // For demo purposes - allow adding locations
    function addLocation(string memory name, string memory description, string memory stampSvg, string memory code) public onlyOwner {
        _addLocation(name, description, stampSvg, code);
    }
    
    // For demo purposes - allow adding perks
    function addPerk(string memory perk) public onlyOwner {
        perks.push(perk);
    }
}