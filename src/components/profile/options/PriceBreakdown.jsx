import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { css } from 'emotion';
import pluralize from 'pluralize';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import styled from '@emotion/styled';
import { serializeDate } from 'utils/misc';

import API  from 'app/api';

import { P, CardRowTotal, paperRoot } from 'assets/styles';
import {
    existingItemRow,
    priceBreakdownContainer,
} from './styles';
import Tip from 'components/common/Tip';

const priceBreakdownWrapper = css`
    margin-bottom: 10px;
    a {
        text-decoration: none;
    }
`

const contentContainer = css`
    display: flex;
    flex: 1;
    align-items: center;
    text-transform: none;
    padding-bottom: 16px;
`
const anchor = css`
    position: relative;
    top: -90px;
`

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

    const stringifiedSelectedOptions = JSON.stringify(props.selectedOptions);

    useEffect(() => {
        const body = {
            application: props.application.id,
            rental_options: props.selectedOptions,
            unit_id: props.unitId,
            lease_term: props.leaseTerm,
            move_in_date: serializeDate(props.moveInDate)
        };
        API.getCurrentFlatQuote(body).then((result) => {
            setPriceBreakdown(result);
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.application.id, stringifiedSelectedOptions, props.unitId, props.leaseTerm, props.moveInDate]);

    const getCurrentCategoryInfo = () => {
        // Count the number of rental options selected
        const categoryCount = Object.values(props.selectedOptions).reduce((a, b) => (a + b), 0);

        let categoryMonthlyPrice = priceBreakdown.items_breakdown[props.category];

        let categoryInfo = 'Your monthly rent may update as you add rental options in the next steps.';

        if (categoryMonthlyPrice != null) {
            if (!categoryMonthlyPrice) categoryMonthlyPrice = '$0';
            categoryInfo = `${categoryMonthlyPrice}/mo for ${categoryCount} ${pluralize(props.categoryHelperText, categoryCount)}`
        }

        return (<>{categoryInfo}</>)
    };

    const hasRentalOptions = priceBreakdown.items_breakdown && Object.keys(priceBreakdown.items_breakdown).length !==0;

    return (
        <PriceBreakdownContainer>
            {!isLoading && (
                <div className={priceBreakdownWrapper}>
                    <div id={props.name} className={anchor}/>
                    <div className={paperRoot}>
                        <div className={contentContainer}>
                            <div>
                                <Box>
                                    <Tip
                                        text={
                                            <P>
                                                <b>{priceBreakdown.total} Monthly Rent</b><br/>
                                                {getCurrentCategoryInfo()}
                                            </P>
                                        }
                                    />
                                </Box>
                            </div>
                        </div>
                        {hasRentalOptions && (
                            <div className={priceBreakdownContainer}>
                                <ExpansionPanel elevation={0} defaultExpanded={false}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        Rent Breakdown
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails classes={{root:classes.root}}>
                                        <div className={existingItemRow}>
                                            Base Rent<span className={"pull-right"}>{priceBreakdown.base_rent}</span>
                                        </div>
                                        {
                                            Object.keys(priceBreakdown.items_breakdown).map(function(key) {
                                                return (
                                                    <div key={key}>
                                                        {priceBreakdown.items_breakdown[key] != null && (
                                                            <div className={existingItemRow}>
                                                                {key}<span className={"pull-right"}>{priceBreakdown.items_breakdown[key] || '$0'}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
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
                        )}
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
