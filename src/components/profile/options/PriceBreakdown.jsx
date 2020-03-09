import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { P, CardRowTotal } from 'assets/styles';
import {
    anchor,
    contentContainer, existingItemRow,
    priceBreakdownContainer,
    paperRoot,
    renterProfileListItemContainer,
} from './styles';
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Box from '@material-ui/core/Box';
import API  from 'app/api';

import Tip from 'components/common/Tip';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'block',
        padding: 0,
    },
}));

function PriceBreakdown (props) {
    const [result, setResult] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const body = { application: props.application.id, new_option: props.currentValues};
        API.getCurrentFlatQuote(body).then((res) => {
            setResult(res);
            setIsLoading(false);
        }).catch(()=>{});

    }, [props.application,props.currentValues ]);
    const classes = useStyles();

    return (
        <>
            {!isLoading && (
                <div className={renterProfileListItemContainer}>
                    <div id={props.name} className={anchor}/>
                    <div className={paperRoot}>
                        <div className={contentContainer}>
                            <div>
                                <Box>
                                    <Tip
                                        text={
                                            <P><b>{result.total} Total Rent</b><br/>Based on your selected rental options</P>
                                        }
                                    />
                                </Box>
                            </div>
                        </div>
                        <div className={priceBreakdownContainer}>
                            <ExpansionPanel elevation={0} defaultExpanded={false}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    Price breakdown
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails classes={{root:classes.root}}>
                                    <div className={existingItemRow}>
                                        Base Rent<span className={"pull-right"}>{result.base_rent}</span>
                                    </div>
                                    {
                                        Object.keys(result.price_breakdown).map(function(key) {
                                            return (
                                                <div key={key} className={existingItemRow}>
                                                    {key}<span className={"pull-right"}>{result.price_breakdown[key]}</span>
                                                </div>)
                                        })}
                                    <CardRowTotal>
                                        <P bold>Total</P>
                                        <div>
                                            <P bold>{result.total}</P>
                                        </div>
                                    </CardRowTotal>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

PriceBreakdown.propTypes = {
    application: PropTypes.object,
    currentValues: PropTypes.object,
}

export default PriceBreakdown;