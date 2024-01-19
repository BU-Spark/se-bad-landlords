SELECT
  property."OWNER",
  sam."FULL_ADDRESS",
  property."CITY",
  count(bpv.sam_id) AS violations_count
FROM
  (
    (
      (
        sam
        JOIN property ON ((sam."PARCEL" = property."PID"))
      )
      JOIN parcel ON ((sam."PARCEL" = parcel."MAP_PAR_ID"))
    )
    JOIN bpv ON ((sam."SAM_ADDRESS_ID" = bpv.sam_id))
  )
WHERE
  ((property.year) :: integer = 2023)
GROUP BY
  property."OWNER",
  sam."FULL_ADDRESS",
  property."CITY"
ORDER BY
  (count(bpv.sam_id)) DESC
LIMIT
  10;