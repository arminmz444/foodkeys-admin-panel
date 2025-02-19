import { useMemo } from 'react';
import _ from '@lodash';
import { useGetScrumboardMembersQuery } from '../ScrumboardApi.js';

function useSelectMember(id) {
	const { data: members } = useGetScrumboardMembersQuery();
	const member = useMemo(() => _.find(members, { id }), [members, id]);
	return member;
}

export default useSelectMember;
