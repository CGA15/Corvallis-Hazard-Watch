import React, { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
// import hazardTypes from "./hazardTypes.json"
import { useDispatch,useSelector } from 'react-redux';
import { selectHazTypes } from '../redux/hazTypesRedux';    
import styled from "@emotion/styled";



const DataItem = ({id, created_at, type, latitude, longitude, text, creator_id, image, icon, radius }) => {
    
    const hazardTypes = useSelector(selectHazTypes)
    const TableData = styled.td`
    border-style: solid;
    padding: 8px;
    textAlign: left;
    `
     const time = new Date(created_at)

    return (
        <tr>
            <TableData>{id}</TableData>
            <TableData>{time.toLocaleString()}</TableData>
            <TableData>{hazardTypes.find(findType => findType.id === type)?.name || "Other"}</TableData>
            <TableData>{latitude}</TableData>
            <TableData>{longitude}</TableData>
            <TableData>{text}</TableData>
            {/* <td>{creator_id}</td>
            <td>{image}</td>
            <td>{icon}</td> */}
            <TableData>{radius}</TableData>
        </tr>
    );
};

export default DataItem;