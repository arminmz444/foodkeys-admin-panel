import Courses from './courses/Courses';

const container = {
	show: {
		transition: {
			staggerChildren: 0.04
		}
	}
};
const item = {
	hidden: {
		opacity: 0,
		y: 10
	},
	show: {
		opacity: 1,
		y: 0
	}
};

/**
 * The WebsiteConfigSettings page.
 */
function WebsiteConfigSettings() {
	// const { data: courses, isLoading } = useGetAcademyCoursesQuery();
	// const { data: categories } = useGetAcademyCategoriesQuery();
	// const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	// const [filteredData, setFilteredData] = useState(courses);
	// const [searchText, setSearchText] = useState('');
	// const [selectedCategory, setSelectedCategory] = useState('all');
	// const [hideCompleted, setHideCompleted] = useState(false);
	// useEffect(() => {
	// 	function getFilteredArray() {
	// 		if (courses && searchText.length === 0 && selectedCategory === 'all' && !hideCompleted) {
	// 			return courses;
	// 		}
	//
	// 		return _.filter(courses, (item) => {
	// 			if (selectedCategory !== 'all' && item.category !== selectedCategory) {
	// 				return false;
	// 			}
	//
	// 			if (hideCompleted && item.progress.completed > 0) {
	// 				return false;
	// 			}
	//
	// 			return item.title.toLowerCase().includes(searchText.toLowerCase());
	// 		});
	// 	}
	//
	// 	if (courses) {
	// 		setFilteredData(getFilteredArray());
	// 	}
	// }, [courses, hideCompleted, searchText, selectedCategory]);
	//
	// function handleSelectedCategory(event) {
	// 	setSelectedCategory(event.target.value);
	// }
	//
	// function handleSearchText(event) {
	// 	setSearchText(event.target.value);
	// }
	//
	// if (isLoading) {
	// 	return <FuseLoading />;
	// }
	return <div><Courses /></div>;
}

export default WebsiteConfigSettings;
