import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DocumentationPageBreadcrumb from '../../DocumentationPageBreadcrumb';
import BasicMasonryComponent from '../components/masonry/BasicMasonry';
import BasicMasonryRaw from '../components/masonry/BasicMasonry.jsx?raw';
import ImageMasonryComponent from '../components/masonry/ImageMasonry';
import ImageMasonryRaw from '../components/masonry/ImageMasonry.jsx?raw';
import MasonryWithVariableHeightItemsComponent from '../components/masonry/MasonryWithVariableHeightItems';
import MasonryWithVariableHeightItemsRaw from '../components/masonry/MasonryWithVariableHeightItems.jsx?raw';
import FixedColumnsComponent from '../components/masonry/FixedColumns';
import FixedColumnsRaw from '../components/masonry/FixedColumns.jsx?raw';
import ResponsiveColumnsComponent from '../components/masonry/ResponsiveColumns';
import ResponsiveColumnsRaw from '../components/masonry/ResponsiveColumns.jsx?raw';
import FixedSpacingComponent from '../components/masonry/FixedSpacing';
import FixedSpacingRaw from '../components/masonry/FixedSpacing.jsx?raw';
import ResponsiveSpacingComponent from '../components/masonry/ResponsiveSpacing';
import ResponsiveSpacingRaw from '../components/masonry/ResponsiveSpacing.jsx?raw';
import SequentialComponent from '../components/masonry/Sequential';
import SequentialRaw from '../components/masonry/Sequential.jsx?raw';
import SSRMasonryComponent from '../components/masonry/SSRMasonry';
import SSRMasonryRaw from '../components/masonry/SSRMasonry.jsx?raw';
function MasonryDoc(props) {
    return (<>
			<div className="flex flex-1 sm:flex-row flex-col items-start justify-center grow-0 md:items-center md:justify-end md:space-between">
				<DocumentationPageBreadcrumb />
				<Button className="normal-case" variant="contained" color="secondary" component="a" href="https://mui.com/components/masonry" target="_blank" role="button" size="small" startIcon={<FuseSvgIcon size={20}>heroicons-outline:external-link</FuseSvgIcon>}>
					Reference
				</Button>
			</div>
			<Typography className="text-32 my-16 font-700" component="h1">
				Masonry
			</Typography>
			<Typography className="description">
				Masonry lays out contents of varying dimensions as blocks of the same width and different height with
				configurable gaps.
			</Typography>

			<Typography className="text-14 mb-32" component="div">
				Masonry maintains a list of content blocks with a consistent width but different height. The contents
				are ordered by row. If a row is already filled with the specified number of columns, the next item
				starts another row, and it is added to the shortest column in order to optimize the use of space.
			</Typography>
			<Typography className="text-24 mt-24 mb-10 font-700" component="h2">
				Basic masonry
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				A simple example of a <code>Masonry</code>. <code>Masonry</code> is a container for one or more items.
				It can receive any element including <code>{`<div />`}</code> and <code>{`<img //>`}</code>.
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				<FuseExample name="BasicMasonry.js" className="my-16" iframe={false} component={BasicMasonryComponent} raw={BasicMasonryRaw}/>
			</Typography>
			<Typography className="text-24 mt-24 mb-10 font-700" component="h2">
				Image masonry
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				This example demonstrates the use of <code>Masonry</code> for images. <code>Masonry</code> orders its
				children by row. If you&#39;d like to order images by column, check out{' '}
				<a href="/material-ui/react-image-list/#masonry-image-list">ImageList</a>.
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				<FuseExample name="ImageMasonry.js" className="my-16" iframe={false} component={ImageMasonryComponent} raw={ImageMasonryRaw}/>
			</Typography>
			<Typography className="text-24 mt-24 mb-10 font-700" component="h2">
				Items with variable height
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				This example demonstrates the use of <code>Masonry</code> for items with variable height. Items can move
				to other columns in order to abide by the rule that items are always added to the shortest column and
				hence optimize the use of space.
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				<FuseExample name="MasonryWithVariableHeightItems.js" className="my-16" iframe={false} component={MasonryWithVariableHeightItemsComponent} raw={MasonryWithVariableHeightItemsRaw}/>
			</Typography>
			<Typography className="text-24 mt-24 mb-10 font-700" component="h2">
				Columns
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				This example demonstrates the use of the <code>columns</code> to configure the number of columns of a{' '}
				<code>Masonry</code>.
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				<FuseExample name="FixedColumns.js" className="my-16" iframe={false} component={FixedColumnsComponent} raw={FixedColumnsRaw}/>
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				<code>columns</code> accepts responsive values:
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				<FuseExample name="ResponsiveColumns.js" className="my-16" iframe={false} component={ResponsiveColumnsComponent} raw={ResponsiveColumnsRaw}/>
			</Typography>
			<Typography className="text-24 mt-24 mb-10 font-700" component="h2">
				Spacing
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				This example demonstrates the use of the <code>spacing</code> to configure the spacing between items. It
				is important to note that the value provided to the <code>spacing</code> prop is multiplied by the
				theme&#39;s spacing field.
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				<FuseExample name="FixedSpacing.js" className="my-16" iframe={false} component={FixedSpacingComponent} raw={FixedSpacingRaw}/>
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				<code>spacing</code> accepts responsive values:
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				<FuseExample name="ResponsiveSpacing.js" className="my-16" iframe={false} component={ResponsiveSpacingComponent} raw={ResponsiveSpacingRaw}/>
			</Typography>
			<Typography className="text-24 mt-24 mb-10 font-700" component="h2">
				Sequential
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				This example demonstrates the use of the <code>sequential</code> to configure the sequential order. With{' '}
				<code>sequential</code> enabled, items are added in order from left to right rather than adding to the
				shortest column.
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				<FuseExample name="Sequential.js" className="my-16" iframe={false} component={SequentialComponent} raw={SequentialRaw}/>
			</Typography>
			<Typography className="text-24 mt-24 mb-10 font-700" component="h2">
				Server-side rendering
			</Typography>
			<Typography className="text-14 mb-32" component="div">
				This example demonstrates the use of the <code>defaultHeight</code>, <code>defaultColumns</code> and{' '}
				<code>defaultSpacing</code>, which are used to support server-side rendering.
			</Typography>
			<div className="border-1 p-16 rounded-16 my-12">
				<Typography className="text-14 mb-32" component="div">
					<code>defaultHeight</code> should be large enough to render all rows. Also, it is worth mentioning
					that items are not added to the shortest column in case of server-side rendering.
				</Typography>
			</div>

			<Typography className="text-14 mb-32" component="div">
				<FuseExample name="SSRMasonry.js" className="my-16" iframe={false} component={SSRMasonryComponent} raw={SSRMasonryRaw}/>
			</Typography>
		</>);
}
export default MasonryDoc;
