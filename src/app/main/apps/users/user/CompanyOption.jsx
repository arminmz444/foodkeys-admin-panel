import { Avatar, Typography } from "@mui/material";
import { Box } from "lucide-react";
import { getServerFile } from "src/utils/string-utils";

const CompanyOption = (props) => {
  const { data, innerProps, innerRef, isFocused, isSelected } = props;
  
  const { name, logo, color } = data;
  
  const logoUrl = logo && getServerFile(logo);
  
  const companyColor = color || "#666";
  
  return (
    <div 
      ref={innerRef}
      {...innerProps}
      style={{
        padding: 16,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #eee",
        backgroundColor: isFocused ? "rgba(0, 0, 0, 0.04)" : "transparent",
        direction: "rtl",
        transition: "background-color 0.2s ease",
        ...(isSelected && {
          backgroundColor: "rgba(25, 118, 210, 0.08)",
          fontWeight: "bold",
        }),
      }}
    >
      <Avatar
        src={logoUrl}
        alt={name}
        sx={{
          width: 40,
          height: 40,
          backgroundColor: logoUrl ? "transparent" : companyColor,
          border: `2px solid ${companyColor}`,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {!logoUrl && name.charAt(0).toUpperCase()}
      </Avatar>
      
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        paddingRight: '4px'
      }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: isSelected ? 700 : 500,
            color: companyColor,
            fontFamily: "inherit",
            fontSize: '1.5rem',
            lineHeight: 1.5, 
            textAlign: 'right'
          }}
        >
          {name}
        </Typography>
        
        {data.description && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontFamily: "inherit",
              maxWidth: "240px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: 'right' // Ensure text alignment
            }}
          >
            {data.description}
          </Typography>
        )}
      </div>
    </div>
  );
};


export default CompanyOption;
