import { FINANCIAL_STREAM_STATUS_INCOMPLETE } from 'constants/constants';
import { prettyCurrency } from 'utils/misc';

export const getIncompleteFinancialSourceWarning = (source, isAsset) => {
    const { adjusted_amount, status } = source;
    const isIncomplete = status === FINANCIAL_STREAM_STATUS_INCOMPLETE;

    if (!isIncomplete) return null;

    let warning;
    if (adjusted_amount) {
        if (isAsset) {
            warning = `The documents for this asset source show a value of ${prettyCurrency(adjusted_amount)}.`;
        } else {
            warning = `The documents for this income source show earnings of ${prettyCurrency(adjusted_amount)}/year.`;
        }
    } else {
        warning = `This ${
            isAsset ? 'asset' : 'income'
        } source has been marked as having incorrect or insufficient documents.`;
    }

    return warning;
};
