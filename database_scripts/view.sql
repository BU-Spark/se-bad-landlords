--full_data_view shows every datapoints in four tables between 2020 to 2023
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
select * from full_data_view;

--violations_view shows top 10 owners that had violations in 2023
drop view if exists violations_view;
create view violations_view as
select
    property."OWNER",
    COUNT(bpv."sam_id") as violations_count
from sam sam
join property property on sam."PARCEL" = property."PID"
join parcel parcel on sam."PARCEL" = parcel."MAP_PAR_ID"
join bpv bpv on sam."SAM_ADDRESS_ID" = bpv."sam_id"
where cast(property."year" as integer) = 2023
group by property."OWNER"
order by violations_count desc
limit 10;
SELECT * FROM violations_view;

--violations_view_sam_id shows top 10 property with most violations in 2023
drop view if exists violations_view_sam_id;
create view violations_view_sam_id as
select
    property."OWNER",
    sam."SAM_ADDRESS_ID" as sam_id,
    COUNT(bpv."sam_id") as violations_count
from sam sam
join property on sam."PARCEL" = property."PID"
join bpv on sam."SAM_ADDRESS_ID" = bpv."sam_id"
where cast(property."year" as integer) = 2023
group by sam."SAM_ADDRESS_ID", property."OWNER"
order by violations_count desc
limit 10;
SELECT * FROM violations_view_sam_id;