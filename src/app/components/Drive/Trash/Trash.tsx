import React, { useCallback } from 'react';
import { c } from 'ttag';

import { useMainArea } from 'react-components';

import FileBrowser from '../../FileBrowser/FileBrowser';
import EmptyTrash from '../../FileBrowser/EmptyTrash';
import useOnScrollEnd from '../../../hooks/useOnScrollEnd';
import { useTrashContent } from './TrashContentProvider';

interface Props {
    shareId: string;
}

function Trash({ shareId }: Props) {
    const mainAreaRef = useMainArea();
    const { loadNextPage, loading, initialized, complete, contents, fileBrowserControls } = useTrashContent();

    const { clearSelections, selectedItems, toggleSelectItem, toggleAllSelected, selectRange } = fileBrowserControls;

    const handleScrollEnd = useCallback(() => {
        // Only load on scroll after initial load from backend
        if (initialized && !complete) {
            loadNextPage();
        }
    }, [initialized, complete, loadNextPage]);

    // On content change, check scroll end (does not rebind listeners)
    useOnScrollEnd(handleScrollEnd, mainAreaRef, 0.9, [contents]);

    return complete && !contents.length && !loading ? (
        <EmptyTrash />
    ) : (
        <FileBrowser
            isTrash
            caption={c('Title').t`Trash`}
            shareId={shareId}
            loading={loading}
            contents={contents}
            selectedItems={selectedItems}
            onToggleItemSelected={toggleSelectItem}
            onEmptyAreaClick={clearSelections}
            onToggleAllSelected={toggleAllSelected}
            onShiftClick={selectRange}
        />
    );
}

export default Trash;
