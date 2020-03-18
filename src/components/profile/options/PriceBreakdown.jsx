import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import styled from '@emotion/styled';

import API  from 'app/api';

import { P, CardRowTotal } from 'assets/styles';
import {
    anchor,
    contentContainer, existingItemRow,
    priceBreakdownContainer,
    paperRoot,
    renterProfileListItemContainer,
} from './styles';
import Tip from 'components/common/Tip';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'block',
        padding: 0,
    },
}));

const PriceBreakdownContainer = styled.div`
    margin-bottom: 20px;
`

function PriceBreakdown (props) {
    const classes = useStyles();
    const [priceBreakdown, setPriceBreakdown] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const body = {
            application: props.application.id,
            rental_options: props.selectedOptions,
            unit_id: props.unitId,
        };
        API.getCurrentFlatQuote(body).then((result) => {
            setPriceBreakdown(result);
            setIsLoading(false);
        });
    }, [props.application, props.selectedOptions, props.unitId]);

    const getCurrentCategoryInfo = () => {
        // Count the number of rental options selected
        const categoryCount = Object.values(props.selectedOptions).reduce((a, b) => (a + b), 0);

        let categoryMonthlyPrice = priceBreakdown.items_breakdown[props.category];

        let categoryInfo = 'Based on your selected rental options';
        if (categoryMonthlyPrice) {
            categoryInfo = `${categoryMonthlyPrice}/mo for ${categoryCount} ${props.categoryHelperText}`
        }

        return (<>{categoryInfo}</>)
    };

    return (
        <PriceBreakdownContainer>
            {!isLoading && (
                <div className={renterProfileListItemContainer}>
                    <div id={props.name} className={anchor}/>
                    <div className={paperRoot}>
                        <div className={contentContainer}>
                            <div>
                                <Box>
                                    <Tip
                                        text={
                                            <P>
                                                <b>{priceBreakdown.total} Total Rent</b><br/>
                                                {getCurrentCategoryInfo()}
                                            </P>
                                        }
                                    />
                                </Box>
                            </div>
                        </div>
                        <div className={priceBreakdownContainer}>
                            <ExpansionPanel elevation={0} defaultExpanded={true}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    Rent breakdown
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails classes={{root:classes.root}}>
                                    <div className={existingItemRow}>
                                        Base Rent<span className={"pull-right"}>{priceBreakdown.base_rent}</span>
                                    </div>
                                    {
                                        Object.keys(priceBreakdown.items_breakdown).map(function(key) {
                                            return (
                                                <div key={key} className={existingItemRow}>
                                                    {key}<span className={"pull-right"}>{priceBreakdown.items_breakdown[key]}</span>
                                                </div>)
                                        })
                                    }
                                    <CardRowTotal>
                                        <P bold>Total</P>
                                        <div>
                                            <P bold>{priceBreakdown.total}</P>
                                        </div>
                                    </CardRowTotal>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    </div>
                </div>
            )}
        </PriceBreakdownContainer>
    );
}

PriceBreakdown.propTypes = {
    application: PropTypes.object,
    selectedOptions: PropTypes.object,
    unitId: PropTypes.number,
    category: PropTypes.string,
    categoryHelperText: PropTypes.string,
}

export default PriceBreakdown;