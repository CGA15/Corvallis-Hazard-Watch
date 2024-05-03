import React from 'react';
import { useSelector } from 'react-redux';
import { selectHazTypes } from '../redux/hazTypesRedux';    
import styled from "@emotion/styled";

const DataItem = ({ id, created_at, type, latitude, longitude, text, radius, location, onClick }) => {
    const hazardTypes = useSelector(selectHazTypes);
    const TableData = styled.td`
        border-style: solid;
        padding: 8px;
        text-align: left;
    `;

    const time = new Date(created_at);

    const handleClick = () => {
        if (onClick) {
            onClick({ latitude, longitude });
        }
    };

    return (
        <tr onClick={handleClick}>
            <TableData>{id}</TableData>
            <TableData>{time.toLocaleString()}</TableData>
            <TableData>{hazardTypes.find(findType => findType.id === type)?.name || "Other"}</TableData>
            {location === "N/A" ? (
                <TableData>{latitude},{longitude}</TableData>
            ) : (
                <TableData>{location}</TableData>
            )}
            <TableData>{text}</TableData>
            <TableData>{radius}</TableData>
        </tr>
    );
};

export default DataItem;
