import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

const Root = styled('div')(({ theme }) => ({
  '& table ': {
    '& th:first-of-type, & td:first-of-type': {
      paddingLeft: `${0}!important`,
    },
    '& th:last-child, & td:last-child': {
      paddingRight: `${0}!important`,
    },
  },

  '& .divider': {
    width: 1,
    backgroundColor: theme.palette.divider,
    height: 144,
  },

  '& .seller': {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.getContrastText(theme.palette.primary.dark),
    marginRight: -88,
    paddingRight: 66,
    width: 480,
    '& .divider': {
      backgroundColor: theme.palette.getContrastText(theme.palette.primary.dark),
      opacity: 0.5,
    },
  },
}));

const InvoiceTab = (props) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return (
    <Root className="grow shrink-0 p-0">
      {props.order && (
        <Card className="w-xl mx-auto shadow-0">
          <CardContent className="p-88 print:p-0">
            <Typography color="text.secondary" className="mb-32">
              {props.order.date}
            </Typography>

            <div className="flex justify-between">
              <div>
                <table className="mb-16">
                  <tbody>
                    <tr>
                      <td className="pb-4">
                        <Typography className="font-light" variant="h6" color="text.secondary">
                          فاکتور
                        </Typography>
                      </td>
                      <td className="pb-4 px-8">
                        <Typography className="font-light" variant="h6" color="inherit">
                          {props.order.reference}
                        </Typography>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <Typography color="text.secondary">
                  {`${props.order.customer.firstName} ${props.order.customer.lastName}`}
                </Typography>

                {props.order.customer.invoiceAddress.address && (
                  <Typography color="text.secondary">
                    {props.order.customer.invoiceAddress.address}
                  </Typography>
                )}
                {props.order.customer.phone && (
                  <Typography color="text.secondary">{props.order.customer.phone}</Typography>
                )}
                {props.order.customer.email && (
                  <Typography color="text.secondary">{props.order.customer.email}</Typography>
                )}
              </div>

              <div className="seller flex items-center p-16">
                <img className="w-80" src="assets/images/logo/logo.svg" alt="قالب ادمین ری اکتی Fuse" />

                <div className="divider mx-8 h-96" />

                <div className="px-8">
                  <Typography color="inherit">FUSE INC.</Typography>

                  <Typography color="inherit">2810 Country Club Road Cranford, NJ 07016</Typography>
                  <Typography color="inherit">+66 123 455 87</Typography>
                  <Typography color="inherit">hello@fuseinc.com</Typography>
                  <Typography color="inherit">www.fuseinc.com</Typography>
                </div>
              </div>
            </div>

            <div className="mt-64">
              <Table className="simple">
                <TableHead>
                  <TableRow>
                    <TableCell>محصول</TableCell>
                    <TableCell>قیمت</TableCell>
                    <TableCell align="right">مقدار</TableCell>
                    <TableCell align="right">جمع</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.order.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Typography variant="subtitle1">{product.name}</Typography>
                      </TableCell>
                      <TableCell align="right">{formatter.format(product.price)}</TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">
                        {formatter.format(product.price * product.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Table className="simple mt-32">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                       جمع کل
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        {formatter.format(props.order.subtotal)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                     مالیات
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        {formatter.format(props.order.tax)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                       تخفیف
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        className="font-normal"
                        variant="subtitle1"
                        color="text.secondary"
                      >
                        {formatter.format(props.order.discount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography className="font-light" variant="h4" color="text.secondary">
                   کل
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography className="font-light" variant="h4" color="text.secondary">
                        {formatter.format(props.order.total)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-96">
              <Typography className="mb-24 print:mb-12" variant="body1">
              لطفا ظرف 15 روز پرداخت کنید. از بیزینس شما متشکرم.
              </Typography>

              <div className="flex">
                <div className="shrink-0">
                  <img className="w-32" src="assets/images/logo/logo.svg" alt="قالب ادمین ری اکتی Fuse" />
                </div>

                <Typography
                  className="font-normal mb-64 px-24"
                  variant="caption"
                  color="text.secondary"
                >
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد کتابهای زیادی در شصت و سه درصد گذشته حال و آینده
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Root>
  );
};

export default memo(InvoiceTab);
