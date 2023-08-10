-- there are many same columns between datasets
-- so I manually stated the columns to display
-- there are more columns but I inputed ones that are in the data diagram
-- the year can go down to 2004 but restricted to between 2020 to 2023
drop view if exists full_data_view;
create view full_data_view as
select
	property."year",
    property."PID",
    property."UNIT_NUM",
    property."CITY",
    property."OWNER",
    parcel."LOC_ID",
    parcel."Shape_STArea__",
    parcel."Shape_STLength__",
    parcel."Shape_Length",
    parcel."Shape_Area",
    sam."SAM_ADDRESS_ID",
    sam."FULL_ADDRESS",
    sam."MAILING_NEIGHBORHOOD",
    sam."ZIP_CODE",
    bpv."status_dttm",
    bpv."status",
    bpv."code",
    bpv."description",
    bpv."latitude",
    bpv."longitude"
from property property
join parcel parcel on property."PID" = parcel."MAP_PAR_ID"
join sam sam on property."PID" = sam."PARCEL"
join bpv bpv on sam."SAM_ADDRESS_ID" = bpv."sam_id"
where cast(property."year" as integer) between 2020 and 2023;

--select * from sam sam;
--select * from "BPV" b;
--select * from property p;
--select * from parcel pa;

select * from full_data_view;


-- this view ranks the owners with 6 or more violations
drop view if exists violations_view;
create view violations_view as
select
    property."OWNER",
    COUNT(bpv."sam_id") as violations_count
from sam sam
join property property on sam."PARCEL" = property."PID"
join parcel parcel on sam."PARCEL" = parcel."MAP_PAR_ID"
join bpv bpv on sam."SAM_ADDRESS_ID" = bpv."sam_id"
where cast(property."year" as integer) between 2020 and 2023
group by property."OWNER", property."PID", property."CITY", sam."FULL_ADDRESS", sam."ZIP_CODE"
having COUNT(bpv."sam_id") > 5
order by violations_count desc;

select * from violations_view;


-- this view shows the ranked owners properties data top to bottom
drop view if exists owner_violations_properties_view;
create view owner_violations_properties_view as
select
    v."OWNER", 
    property."PID", 
    property."CITY", 
    sam."FULL_ADDRESS", 
    sam."ZIP_CODE",
    v."violations_count"
from violations_view v
join property property on v."OWNER" = property."OWNER"
join sam sam on property."PID" = sam."PARCEL";

select * from owner_violations_properties_view ORDER BY violations_count DESC;
