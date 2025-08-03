// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract COData{
    struct Reading {
        uint256 timestamp;
        uint256 co_ugm3; // CO en µg/m³
    }

    Reading[] public readings;

    event NewReading(uint256 timestamp, uint256 co_ugm3);

    function addReading(uint256 _co_ugm3) external {
        readings.push(Reading(block.timestamp, _co_ugm3));
        emit NewReading(block.timestamp, _co_ugm3);
    }

    function getReadingCount() external view returns (uint256) {
        return readings.length;
    }

    function getReading(uint256 index) external view returns (uint256, uint256) {
        require(index < readings.length, "Indice fuera de rango");
        Reading memory reading = readings[index];
        return (reading.timestamp, reading.co_ugm3);
    }
}